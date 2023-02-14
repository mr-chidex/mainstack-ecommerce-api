import 'dotenv/config';

const config = {
  API_VERSION: process.env.API_VERSION!,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL!,
  SECRET_KEY: process.env.SECRET_KEY!,
};

export default config;
