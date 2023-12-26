import { PrismaClient } from "@prisma/client";
import { BlogCreateInput } from "../../core/types";

const createBlog = async (data: BlogCreateInput, db: PrismaClient) => {
    {
        return db.blog.create({
            data: {
                slug: data.slug,
                name: data.name,
                posts: {
                    create: data.posts,
                },
            },
        })
    }
}

export default createBlog
