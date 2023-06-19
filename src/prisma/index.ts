import { createSchema } from "schemix";

createSchema({
  // basePath should be a path to the folder containing models/, enums/, and mixins/.
  basePath: __dirname,
  datasource: {
    provider: "mongodb",
    url: { env: "DATABASE_URL" },
  },
  generator: {
    provider: "prisma-client-js",
  },
}).export(__dirname, "schema");
