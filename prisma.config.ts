import { config } from 'dotenv';
import path from 'node:path';
import type { PrismaConfig } from 'prisma';
import { LoggerAdapter } from './src/adapters/logger/LoggerAdapter';

config({
  path: '.env.development'
});

const logger = new LoggerAdapter();
logger.colorfully(`<magenta>DotEnv Config: <cyan>${process.env.NODE_ENV}`);
logger.colorfully(`<magenta>Database_url: <cyan>${process.env.DATABASE_URL}`);

export default {
  schema: path.join('src/infrastructure/database/prisma', 'schema.prisma'),
  // migrations: {
  //   path: path.join("db", "migrations"),
  // },
  // views: {
  //   path: path.join("db", "views"),
  // },
  // typedSql: {
  //   path: path.join("db", "queries"),
  // }
} satisfies PrismaConfig;
