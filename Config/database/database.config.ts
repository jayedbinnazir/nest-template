export interface DatabaseConfig {
  type: string;
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  logger: string;
}

export default (): DatabaseConfig => ({
  type: process.env.DB_TYPE || 'postgres',
  url: process.env.DB_URL || '',
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
  logging: process.env.DB_LOGGING === 'true',
  logger: process.env.DB_LOGGER || 'advanced-console',
});
