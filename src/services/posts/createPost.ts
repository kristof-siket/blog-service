import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../../prisma/contract'
import { PostCreateInput } from '../../core/types'

const createPost = async (data: PostCreateInput, blogId: string, db: PostgresClient<Contract>) => {
    return db.orm.public.Post.create({
        title: data.title,
        content: data.content,
        blogId: blogId,
    })
}

export default createPost
