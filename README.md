# Blog Service prototype

This is an initial blog microservice that can manage reading and manipulation of blogs and posts. The main technology stack is Node.js with TypeScript, Apollo GraphQL and Prisma.

To summarize the solution, it is a GraphQL service, which is meant to be a "subgraph" of a federated supergraph using Apollo Federation. The idea is that our API Gateway provides a single schema for clients while the backend is implemented as a distributed, micro-service architecture.

# Starting the app

For local testing on host, you can first run `npm i`, then generate the Prisma client via `npx prisma generate`. Then, create a `.env` file with a database connection string set as value of the `DATABASE_URL` variable (you need to create a local or remote database first). Lastly, you can run the `npx prisma db push` command to push the schema into the database, and then the `npx prisma db seed` to have some test data as well.

Now, you can start the app with `npm run dev` and open the Apollo playground page at `http://localhost:4000`.

You can also opt in for the Docker-based setup (this is a bit unfinished yet). You can run `docker-compose build` and `docker-compose up`. To start a stack of a local DB and the service. It should also expose the page on the same port.

# Q&A

Here I'm answering some questions regarding the architectural decisions, tradeoffs, and possible improvements of the application.

## What were some of the reasons you chose the technology stack that you did?

As I stated, the main tech stack is Node.js with TS, Apollo Server and Prisma. In my opinion, Node.js is a good choice for building microservices. Its event loop mechanism ensures high performance when serving many requests simultaneously, and it is easy to horizontally scale (e.g. with pm2 processes, K8s pods, deploying as serverless function, etc).

TypeScript might be a bit questionable as the goal was to build the service quickly - however, in my opinion, the time we lose by setting it up, we quickly gain back by its benefits (e.g. it doesn't take hours of debugging to find reasons of data type mismatches). Also, I took a boilerplate in which TS was configured by default so I didn't really lose time with it.

Apollo, and GraphQL in general, is a good choice for this task because the functional requirements suggest some need for flexibility on the client side ("let the client decide if they want the Posts with the blog or not"). REST is capable of the same by introducing query variables, but that is not a nicely scaleable solution - in 99,9999% of the cases, the clients (i.e. "frontend team", public API users, etc.) would change their mind and ask for adding or removing data from the response. With GraphQL, we give them all the freedom. Also, GraphQL is perfect for giving a single interface for accessing data from many different sources - if we build other services, manage more databases, clients would still see the whole thing as one nicely typed data model, even though I might have all the data sources from RDBMS to NoSQL, blob storages and what not.

Last but not least, Prisma, as the best ORM I know for Node.js, ensures type safety and flexibility in terms of data sources (see Bonus requirement, if I understand it correctly, by using an ORM, we are already quite good with switching to another data source). It can also solve the infamous N+1 problem that GraphQL introduces when querying related data, so it generally works nicely as the "backend" of a GraphQL API.

## What were some of the trade-offs you made when building this application? Why were these acceptable trade-offs?

One of them is choosing GraphQL, which has a couple of drawbacks, such as its extra complexity, the fact that it doesn't leverage HTTP features well. I think it is acceptabe because the above mentioned gains overshadow the painpoints, plus the app is built in a way that we could switch to another API architecture type by simply changing the API layer (stuff in the `services` folder would be nicely usable to back RESTful routes as well).

Another tradeoff was going with ORM instead of native queries or some more lightweight solution. In my opinion, in case of such a system, using native queries would be a no-go - the level of query optimization that I can reach with Prisma is more than enough for the use cases listed in the requirements. Prisma comes with the drawback that it limits the usable DBs to the supported ones only - which are the most widely used databases, so we would probably anyway choose one of those. Again, its benefits overshadow its drawbacks, so the tradeoff is acceptable.

## Given more time, what improvements or optimizations would you want to add? When would you add them?

Here I have many things to say, so I open another level of listing.

- Local DevEx / Continuous Development features:
  The local development setup is quite laggy at the moment. For example, I didn't use Prisma Migrate - in my opinion, it is quite an important piece of the toolchain. Also, there is no command that starts a proper development environment without dependencies (for `dev`, I need a running database). The docker-based setup is also quite half-ready. Additionally, a development environment for a team seeking high quality would include static code analysis, CI/CD pipeline with automated test execution, GraphQL schema checks and what not. **When**: I would add these incrementally as the project is growing, but most of the mentioned things should be configured at an early stage of the project.

- Auth, Access Control:
  Currently there is no authentication and access control defined for this service. As I see it, receiving and decoding an access token shouldn't happen in this microservice. It could be done by a serparate service that is responsible for user management, or as part of our API Gateway (in case of Apollo, it could be a Rhai script or an external co-processor). The service itself should be responsible for handling its own permission scopes, so it should indeed know what are the capabilities of the user making the given request. **When**: this should be done before publishing the service to prod.

- Rate limitation:
  This could probably be done outside of this service, but GraphQL implies some extra risks here as well - without proper operation limits, the one malicious user can overload the server even with a single request (by a too long or too deep one). Rules for this can be configured at the Apollo Router's config (the Gateway we would put the subgraphs behind), but Cloudflare also offers a similar service. **When**: as it is a security aspect, it should be considered from the very beginning, but probably it is mostly done outside of this service.

- Nexus:
  I've honestly never used Nexus for the schema definitions yet, but I think it would be a nice improvement because of its extra type safety (and I also think using actual code is better than any form of string, even if the IDE extensions make it readable). **When**: the earlier we add it, the easier it gets (as we don't need to rewrite existing schema). But it is not a top-priority and we can add it service by service.

- More queries, mutations, pagination, filtering, etc:
  The current API basically implements the requirements from the specification, but APIs should be a bit more general-purpose. To support this, it would be nice to implement all the required CRUD operations (Update, Delete), convenience features such as pagination, sorting and filtering. **When**: as the usage increases, the API can get more and more mature and optimized.

## What would you need to do to make this application scale to hundreds of thousands of users?

I would like to approach this topic from two separate angles: **primary** and **secondary measures**.

The primary measures are around the direct scalability of this service itself. So, given some hundreds of thousands of users, assuming that all of them are active and all of their requests trigger actual data fetches, the service should still operate efficiently.

To achieve this, we need to _deploy it in a scaleable way_. As Node.js is single-threaded, our option is horizontal scaling, which can be done several ways

- Using PM2 or other process managers, adapt the amount of processes based on the demand
- Use K8s, which can easily be configured for autoscaling, creating as many pods as required dynamically.
- Go Serverless, and deploy this service as a function.

Which option is the best? It highly depends on the requirements and other details of our solution. For example, with the imagined setup with Apollo Router and more subgraphs, Kubernetes is quite handy as we can configure the networking between the services to the lowest possible latency. But of course, it is also possible to implement all subgraphs as separate function deployments.

Besides **scaling the app**, we should also primarily deal with **scaling the database**. When we have an upscaled situation, we have to think about the increased number of database connections. It can go quite extreme in case of Serverless setup, as by default, the on-the-fly execution introduces a fresh DB connection each and every time - connection pooling is a good measure for this. Also, we have to investigate the most popular query patterns and create indexes to reduce latency and therefore increase DB availability. Introducing read replicas, or sharding are also great measures for preparing the database for massive load.

The basis of our primary measures is a reliable, elastic cloud-based infrastructure. An important feature is cost control and monitoring, as scaling up heavily can also heavily increase the operation costs.

The secondary measure is caching, which can drastically increase our systems loadability. For example, if we support our primary database with a Redis cache, we go less times to the DB, and therefore the DB's upscaling can be postponed. Also, if we put our service into a real blog's context, it might actually be a good idea to use SSG (static site generation) and cache our generated contents on a CDN - which would ensure that most of the page loads doesn't even need to reach our backend systems.

The reason why I'm mentioning caching as a secondary measure is that the one should never design a system that uses caching as the main mechanism to deal with increased load - cache is there to support and speed things up, but they are not the main sources of truth.

## How would you change the architecture to allow for models that are stored in different databases? E.g. posts are stored in Cassandra and blogs are stored in Postgres.

One popular rule-of-thumb is to have one database per service, which of course is not a "law", but definitely something to consider. If we go this way, we implement a completely different microservice for posts - in our current architecture, the users would still be able to easily query to Posts of a Blog using the federated graph.

Another option is making this service manage the two databases. It can have good reasons - Posts and Blogs are quite close to each other in terms of domain, and they should probably be taken care by the same dev team. In this case, our data access layer has to deal with the two data sources. We can orchestrate "manually" between the two data sources in our `services`.

One thing that Apollo Federation doesn't nicely solve is Saga Orchestration, so if the success of Blog Creation would depend on the success of related Post creation, and Posts would be created in a separate service, we might have a bit harder time implementing the rollback mechanism to avoid data inconsistency.
