import { createSchema } from 'graphql-yoga'
import { DateTimeResolver } from 'graphql-scalars'
import { Context } from './context'
import gql from 'gql-tag'

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
    postById: (_parent, args: { id: string }, context: Context) => {
      return context.prisma.post.findUnique({
        where: { id: args.id || undefined },
      })
    },
    blogById: (_parent, args: { id: string }, context: Context) => {
      return context.prisma.blog.findUnique({
        where: { id: args.id || undefined },
      })
    },
    blogBySlug: (_parent, args: { slug: string }, context: Context) => {
      return context.prisma.blog.findUnique({
        where: { slug: args.slug || undefined },
      })
    },
  },
  Mutation: {
    createBlog: (_parent, args: { data: { slug: string; name: string } }, context: Context) => {
      return context.prisma.blog.create({
        data: {
          slug: args.data.slug,
          name: args.data.name,
        },
      })
    },
    createPost: (_parent, args: { data: PostCreateInput; blogId: string }, context: Context) => {
      return context.prisma.post.create({
        data: {
          title: args.data.title,
          content: args.data.content,
          blog: { connect: { id: args.blogId } },
        },
      })
    },
  },
  Blog: {
    posts: (parent, _args, context: Context) => {
      // .posts() to avoid n+1
      return context.prisma.blog.findUnique({ where: { id: parent.id || undefined } }).posts()
    },
  },
  DateTime: DateTimeResolver,
}

export const schema = createSchema({
  typeDefs,
  resolvers,
})
