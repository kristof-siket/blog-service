import { context } from './context'
import { schema } from './schema'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';

// Create Apollo Server
const server = new ApolloServer({
  ...schema,
})

// Start Apollo Server
startStandaloneServer(server, {
  context: async () => context
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})
