"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.resolvers = exports.typeDefs = void 0;
const graphql_scalars_1 = require("graphql-scalars");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const services_1 = require("../services");
/**
 * TODOS
 * - Pagination & Sorting
 * - Return all posts that contain a specific piece of text (leverage full-text search)
 * - Nexus
 */
exports.typeDefs = (0, graphql_tag_1.default) `
  type Post @key(fields: "id") {
    id: String!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    viewCount: Int!
    title: String
  }

  type Blog @key(fields: "id") {
    id: String!
    slug: String!
    name: String!
    posts: [Post!]!
  }

  input PostCreateInput {
    content: String!
    title: String
  }

  input BlogCreateInput {
    slug: String!
    name: String!
    posts: [PostCreateInput!]
  }

  input BlogByIdInput {
    id: String!
  }

  input BlogBySlugInput {
    slug: String!
  }

  type Query {
    postById(id: String!): Post
    blogById(id: String!): Blog
    blogBySlug(slug: String!): Blog
  }

  type Mutation {
    createBlog(data: BlogCreateInput!): Blog!
    createPost(data: PostCreateInput!, blogId: String!): Post!
  }

  scalar DateTime
`;
// TODO: Add real types if possible for _parent
exports.resolvers = {
    Query: {
        postById: (_parent, args, context) => (0, services_1.getPostById)(args.id, context.prisma),
        blogById: (_parent, args, context) => (0, services_1.getBlogById)(args.id, context.prisma),
        blogBySlug: (_parent, args, context) => (0, services_1.getBlogBySlug)(args.slug, context.prisma),
    },
    Mutation: {
        createBlog: (_parent, args, context) => (0, services_1.createBlog)(args.data, context.prisma),
        createPost: (_parent, args, context) => (0, services_1.createPost)(args.data, args.blogId, context.prisma),
    },
    Blog: {
        __resolveReference: (parent, _args, context) => (0, services_1.getBlogById)(parent.id, context.prisma),
        posts: (parent, _args, context) => (0, services_1.getPostsOfBlog)(parent.id, context.prisma),
    },
    Post: {
        __resolveReference: (parent, _args, context) => (0, services_1.getPostById)(parent.id, context.prisma),
    },
    DateTime: graphql_scalars_1.DateTimeResolver,
};
exports.schema = {
    typeDefs: exports.typeDefs,
    resolvers: exports.resolvers,
};
