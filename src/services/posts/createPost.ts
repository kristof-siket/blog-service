import { PrismaClient } from "@prisma/client"
import { PostCreateInput } from "../../core/types"

const createPost = async (data: PostCreateInput, blogId: string, db: PrismaClient) => {
    return db.post.create({
        data: {
            title: data.title,
            content: data.content,
            blogId: blogId,
        },
    })
}

export default createPost
