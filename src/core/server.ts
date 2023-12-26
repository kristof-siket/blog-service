import { context } from './context'
import { resolvers, typeDefs } from './schema'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph'

// Create Apollo Server
const server = new ApolloServer({
  // We are building a federated subgraph, as this might be part of a larger graph
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
})

// Start Apollo Server
startStandaloneServer(server, {
  context: async () => context
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})
