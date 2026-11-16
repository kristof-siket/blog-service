import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../../prisma/contract'
import { BlogCreateInput } from '../../core/types'

const createBlog = async (data: BlogCreateInput, db: PostgresClient<Contract>) => {
    if (data.posts) {
        return db.orm.public.Blog.create({
            slug: data.slug,
            name: data.name,
            posts: (p) => p.create(data.posts!),
        })
    }
    return db.orm.public.Blog.create({
        slug: data.slug,
        name: data.name,
    })
}

export default createBlog
