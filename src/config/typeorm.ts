import { registerAs } from '@nestjs/config';
import { all } from 'axios';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  dropSchema: false,
  logging: 'all',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  extra: {
    connectionTimeoutMillis: 45000,
  },
  ssl: {
    rejectUnauthorized: false,
  },
};

export default registerAs('typeorm', () => config);
export const connetionSource = new DataSource(config as DataSourceOptions);
