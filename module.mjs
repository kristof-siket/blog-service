import { module } from '@prisma/composer'
import { postgres, dataContract } from '@prisma/composer-prisma-cloud/orm'
import service from './src/service.mjs'
import contractJson from './src/prisma/contract.json' with { type: 'json' }

const catalogData = dataContract(contractJson)

export default module('blog-service', ({ provision }) => {
  const db = provision(
    postgres({
      name: 'db',
      contract: catalogData,
      config: './prisma.config.ts',
    }),
  )
  provision(service, { deps: { db } })
})
