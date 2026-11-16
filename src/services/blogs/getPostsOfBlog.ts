import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../../prisma/contract'

const getPostsOfBlog = async (blogId: string, db: PostgresClient<Contract>) => {
    return db.orm.public.Post.where({ blogId: blogId || undefined }).all()
}

export default getPostsOfBlog
