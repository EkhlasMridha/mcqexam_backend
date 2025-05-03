import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  connectionString: process.env.CONNECTION_STRING,
  dbName: process.env.DB_NAME,
}));
