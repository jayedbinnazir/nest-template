import databaseConfig from './Config/database/database.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Dynamically load the correct .env file based on NODE_ENV, default to .env.dev
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.dev';
dotenv.config({ path: envFile });

import { DataSource } from 'typeorm';




const config = databaseConfig();

console.log("config------------------>",config);

console.log("path------------------>",path.join(__dirname, '**', '*.entity.{ts,js}'));
console.log("path------------------>",path.join(__dirname, 'migrations', '*.{ts,js}'));

export const AppDataSource = new DataSource({
  type: config.type as any,
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  entities: [path.join(__dirname, 'src', '**', '*.entity.{ts,js}')], // Corrected entity path
  migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')], // Use 'migration' folder in root directory
  migrationsTableName: 'migrations',
  logging: config.logging,
  logger: config.logger as any,
  synchronize: config.synchronize,
}); 


// Why dotenv.config() is needed in data-source.ts
// When running migrations with the TypeORM CLI, your data-source.ts is executed as a plain Node.js script.
// TypeORM CLI does NOT use NestJS’s @nestjs/config module, so it does not automatically load your .env files.
// By adding import * as dotenv from 'dotenv'; dotenv.config({ path: '.env.dev' }); at the top of data-source.ts, you ensure that all your environment variables are loaded into process.env before your config is read.
// This allows your databaseConfig() function to work as expected, just like it does in your NestJS app.