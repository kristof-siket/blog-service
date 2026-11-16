import service from '../service.mjs'
import type { PostgresClient } from '@prisma/orm-postgres/runtime'
import type { Contract } from '../prisma/contract'

const { db } = service.load()

export interface Context {
  prisma: PostgresClient<Contract>
}

// TODO auth (i.e. creation of RBAC or other access control mechanism)
export const context: Context = {
  prisma: db.client,
}
