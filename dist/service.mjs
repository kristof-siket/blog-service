import { compute } from '@prisma/composer-prisma-cloud';
import { postgres, dataContract } from '@prisma/composer-prisma-cloud/orm';
import node from '@prisma/composer/node';
import contractJson from './prisma/contract.json' with { type: 'json' };
const data = dataContract(contractJson);
// The service declaration: on Compute the database arrives through this
// service's `db` dependency, and the app reads it with `service.load()`.
const service = compute({
    name: 'api',
    deps: { db: postgres(data) },
    build: node({
        module: import.meta.url,
        // The built tree, copied whole, so the entry's relative imports
        // (context, the service declaration, the contract) resolve inside it.
        dir: '../dist',
        entry: 'core/server.js',
        // tsc leaves installed packages as requires; deploy traces and stages them.
        dependencies: 'external',
    }),
});
export default service;
