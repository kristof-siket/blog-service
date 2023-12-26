import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const blogData: Prisma.BlogCreateInput[] = [
  {
    slug: 'my-blog',
    name: 'My Blog',
    posts: {
      create: [
        {
          title: 'My first post',
          content: 'Hello world!',
        },
      ],
    },
  },
  {
    slug: 'my-second-blog',
    name: 'My second blog',
    posts: {
      create: [
        {
          title: 'My second post',
          content: 'Hello world again!',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const blog of blogData) {
    const user = await prisma.blog.create({
      data: blog,
    })
    console.log(`Created blog with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
