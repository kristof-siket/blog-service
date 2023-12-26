import { PrismaClient } from "@prisma/client";

const getPostsOfBlog = async (blogId: string, db: PrismaClient) => {
    // .posts() to avoid n+1
    return db.blog.findUnique({ where: { id: blogId || undefined } }).posts()
}

export default getPostsOfBlog
