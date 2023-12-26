# Blog Service prototype

This is an initial blog microservice that can manage reading and manipulation of blogs and posts. The main technology stack is Node.js with TypeScript, Apollo GraphQL and Prisma.

To summarize the solution, it is a GraphQL service, which is meant to be a "subgraph" of a federated supergraph using Apollo Federation. The idea is that our API Gateway provides a single schema for clients while the backend is implemented as a distributed, micro-service architecture.

# Starting the app

For local testing on host, you can first run `npm i`, then generate the Prisma client via `npx prisma generate`. Then, create a `.env` file with a database connection string set as value of the `DATABASE_URL` variable (you need to create a local or remote database first). Lastly, you can run the `npx prisma db push` command to push the schema into the database, and then the `npx prisma db seed` to have some test data as well.

Now, you can start the app with `npm run dev` and open the Apollo playground page at `http://localhost:4000`.

You can also opt in for the Docker-based setup (this is a bit unfinished yet). You can run `docker-compose build` and `docker-compose up`. To start a stack of a local DB and the service. It should also expose the page on the same port.

# Q&A

Here I'm answering some questions regarding the architectural decisions, tradeoffs, and possible improvements of the application.

1. What were some of the reasons you chose the technology stack that you did?

As I stated, the main tech stack is Node.js with TS, Apollo Server and Prisma. In my opinion, Node.js is a good choice for building microservices. Its event loop mechanism ensures high performance when serving many requests simultaneously, and it is easy to horizontally scale (e.g. with pm2 processes, K8s pods, deploying as serverless function, etc).

TypeScript might be a bit questionable as the goal was to build the service quickly - however, in my opinion, the time we lose by setting it up, we quickly gain back by its benefits (e.g. it doesn't take hours of debugging to find reasons of data type mismatches). Also, I took a boilerplate in which TS was configured by default so I didn't really lose time with it.

Apollo, and GraphQL in general, is a good choice for this task because the functional requirements suggest some need for flexibility on the client side ("let the client decide if they want the Posts with the blog or not"). REST is capable of the same by introducing query variables, but that is not a nicely scaleable solution - in 99,9999% of the cases, the clients (i.e. "frontend team", public API users, etc.) would change their mind and ask for adding or removing data from the response. With GraphQL, we give them all the freedom. Also, GraphQL is perfect for giving a single interface for accessing data from many different sources - if we build other services, manage more databases, clients would still see the whole thing as one nicely typed data model, even though I might have all the data sources from RDBMS to NoSQL, blob storages and what not.

Last but not least, Prisma, as the best ORM I know for Node.js, ensures type safety and flexibility in terms of data sources (see Bonus requirement, if I understand it correctly, by using an ORM, we are already quite good with switching to another data source). It can also solve the infamous N+1 problem that GraphQL introduces when querying related data, so it generally works nicely as the "backend" of a GraphQL API.

2. What were some of the trade-offs you made when building this application? Why
   were these acceptable trade-offs?

One of them is choosing GraphQL, which has a couple of drawbacks, such as its extra complexity,
