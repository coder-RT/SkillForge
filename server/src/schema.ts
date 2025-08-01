import { PrismaClient } from '@prisma/client';
import { objectType, stringArg, intArg, mutationType, queryType, asNexusMethod, makeSchema, nonNull, enumType } from 'nexus';
import { join, dirname } from 'path';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import { fileURLToPath } from 'url';

export const JSONScalar = asNexusMethod(GraphQLJSON, 'json', 'JSON');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Custom scalar for DateTime
export const DateTimeScalar = asNexusMethod(
  GraphQLDateTime,
  'dateTime',
  'DateTime',
)

export const schema = makeSchema({
  types: [], // 1
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), // 2
    typegen: join(process.cwd(), "nexus-typegen.ts"), // 3
  },
})

