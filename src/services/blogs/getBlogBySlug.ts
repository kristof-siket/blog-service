import { PrismaClient } from "@prisma/client";

const getBlogBySlug = async (slug: string, db: PrismaClient) => {
    return db.blog.findUnique({
        where: { slug: slug || undefined },
    })
}

export default getBlogBySlug
