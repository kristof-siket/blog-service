import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../../prisma/contract'

const getPostById = async (id: string, db: PostgresClient<Contract>) => {
    return db.orm.public.Post.first({ id: id || undefined })
}

export default getPostById
