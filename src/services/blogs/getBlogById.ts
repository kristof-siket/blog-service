import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../../prisma/contract'

const getBlogById = async (id: string, db: PostgresClient<Contract>) => {
  return db.orm.public.Blog.first({ id: id || undefined })
}

export default getBlogById
