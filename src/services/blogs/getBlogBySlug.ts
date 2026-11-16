import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../../prisma/contract'

const getBlogBySlug = async (slug: string, db: PostgresClient<Contract>) => {
    return db.orm.public.Blog.where({ slug: slug || undefined }).first()
}

export default getBlogBySlug
