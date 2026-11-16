import { defineConfig as orm, prisma7Schema } from "@prisma/orm-postgres/config";
import { defineConfig as composer } from "@prisma/composer/config";
import { nodeBuild } from "@prisma/composer/node/control";
import { prismaCloud, prismaState } from "@prisma/composer-prisma-cloud/control";
import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  orm: orm({
    contract: prisma7Schema("prisma/schema.prisma"),
    output: "src/prisma",
  }),
  composer: composer({
    entry: "./module.mjs",
    extensions: [prismaCloud(), nodeBuild()],
    state: prismaState(),
  }),
});
