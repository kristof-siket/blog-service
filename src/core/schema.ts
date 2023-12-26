import { DateTimeResolver } from 'graphql-scalars'
import gql from 'graphql-tag'
import { BlogCreateInput, PostCreateInput } from './types'
import { createBlog, createPost, getBlogById, getBlogBySlug, getPostById, getPostsOfBlog } from '../services'


/**
 * TODOS
 * - Pagination & Sorting
 * - Return all posts that contain a specific piece of text (leverage full-text search)
 * - Nexus
 */

export const typeDefs = gql`
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
`

// TODO: Add real types if possible for _parent
export const resolvers = {
  Query: {
    postById: (_parent: any, args: { id: string }, context) => getPostById(args.id, context.prisma),
    blogById: (_parent: any, args: { id: string }, context) => getBlogById(args.id, context.prisma),
    blogBySlug: (_parent: any, args: { slug: string }, context) => getBlogBySlug(args.slug, context.prisma),
  },
  Mutation: {
    createBlog: (_parent: any, args: { data: BlogCreateInput }, context) => createBlog(args.data, context.prisma),
    createPost: (_parent: any, args: { data: PostCreateInput; blogId: string }, context) => createPost(args.data, args.blogId, context.prisma),
  },
  Blog: {
    __resolveReference: (parent: any, _args, context) => getBlogById(parent.id, context.prisma),
    posts: (parent: any, _args, context) => getPostsOfBlog(parent.id, context.prisma),
  },
  Post: {
    __resolveReference: (parent: any, _args, context) => getPostById(parent.id, context.prisma),
  },
  DateTime: DateTimeResolver,
}

export const schema = {
  typeDefs,
  resolvers,
}
