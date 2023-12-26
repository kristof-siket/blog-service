import { PrismaClient } from "@prisma/client";

const getBlogById = async (id: string, db: PrismaClient) => {
  return db.blog.findUnique({
    where: { id: id || undefined },
  })
}

export default getBlogById
