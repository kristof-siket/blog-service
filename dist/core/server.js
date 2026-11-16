"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_mjs_1 = __importDefault(require("../service.mjs"));
const context_1 = require("./context");
const schema_1 = require("./schema");
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const subgraph_1 = require("@apollo/subgraph");
// Create Apollo Server
const server = new server_1.ApolloServer({
    // We are building a federated subgraph, as this might be part of a larger graph
    schema: (0, subgraph_1.buildSubgraphSchema)({ typeDefs: schema_1.typeDefs, resolvers: schema_1.resolvers }),
});
// Start Apollo Server on the service's reserved port, on every interface
(0, standalone_1.startStandaloneServer)(server, {
    context: async () => context_1.context,
    listen: {
        port: service_mjs_1.default.port(),
        host: '0.0.0.0',
    },
}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
