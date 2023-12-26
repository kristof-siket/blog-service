import { PrismaClient } from "@prisma/client";

const getPostById = async (id: string, db: PrismaClient) => {
    return db.post.findUnique({
        where: { id: id || undefined },
    })
}

export default getPostById
