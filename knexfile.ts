// Update with your config settings.
import fs from 'fs'
import path from 'path'
import { Knex } from 'knex'

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const getCertPath = () => {
  // For local development
  // if (process.env.NODE_ENV !== 'production') {
  //   return path.join(__dirname, 'certs', 'prod-ca-2021.cer');
  // }
  // For Vercel production
  return path.join(process.cwd(), 'certs', 'prod-ca-2021.crt')
}

console.log('KNEX FILE')
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'mondocite_dev',
      user: 'postgres',
      password: '',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      extension: 'ts',
    },
  },
  production: {
    client: 'postgres', // Changed from 'postgresql' to 'pg'
    // connection: process.env.DATABASE_URL, // Using the URL directly without the object
    connection: {
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        ca: fs.readFileSync(getCertPath()).toString(),
        // Remove rejectUnauthorized: false as we're now verifying with the proper cert
      },
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: './migrations',
    },
    pool: { min: 0, max: 7 }, // Match your working pool settings
  },
}

export default config
