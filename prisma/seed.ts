import postgres from '@prisma/orm-postgres/runtime'
import { contractFromJson } from '@prisma/orm-postgres/static'
import type { Contract } from '../src/prisma/contract'
import contractJson from '../src/prisma/contract.json'

const db = postgres({
  contract: contractFromJson<Contract>(contractJson),
  url: process.env['DATABASE_URL']!,
})

// TODO: it would be a bit better with upsert(). And/Or using a faker library.
const blogData = [
  {
    slug: 'my-blog',
    name: 'My Blog',
    posts: [
      {
        title: 'My first post',
        content: 'Hello world!',
      },
    ],
  },
  {
    slug: 'my-second-blog',
    name: 'My second blog',
    posts: [
      {
        title: 'My second post',
        content: 'Hello world again!',
      },
    ],
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const blog of blogData) {
    const newBlog = await db.orm.public.Blog.create({
      slug: blog.slug,
      name: blog.name,
      posts: (p) => p.create(blog.posts),
    })
    console.log(`Created blog with id: ${newBlog.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await db.close()
  })
  .catch(async (e) => {
    console.error(e)
    await db.close()
    process.exit(1)
  })
