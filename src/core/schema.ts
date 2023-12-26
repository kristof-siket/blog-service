import { buildSubgraphSchema } from '@apollo/subgraph'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import gql from 'gql-tag'
import { BlogCreateInput, PostCreateInput } from './types'
import { createBlog, createPost, getBlogById, getBlogBySlug, getPostById, getPostsOfBlog } from '../services'


export const typeDefs = gql`
  type Post {
    id: String!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    viewCount: Int!
    title: String
  }

  type Blog {
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

export const resolvers = {
  Query: {
    postById: (_parent: any, args: { id: string }, context: Context) => getPostById(args.id, context.prisma),
    blogById: (_parent: any, args: { id: string }, context: Context) => getBlogById(args.id, context.prisma),
    blogBySlug: (_parent: any, args: { slug: string }, context: Context) => getBlogBySlug(args.slug, context.prisma),
  },
  Mutation: {
    createBlog: (_parent: any, args: { data: BlogCreateInput }, context: Context) => createBlog(args.data, context.prisma),
    createPost: (_parent: any, args: { data: PostCreateInput; blogId: string }, context: Context) => createPost(args.data, args.blogId, context.prisma),
  },
  Blog: {
    posts: (parent: any, _args: never, context: Context) => getPostsOfBlog(parent.id, context.prisma),
  },
  DateTime: DateTimeResolver,
}

export const schema = {
  typeDefs,
  resolvers,
}
