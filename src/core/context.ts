import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
}

// TODO auth (i.e. creation of RBAC or other access control mechanism)
export const context: Context = {
  prisma: prisma,
}
