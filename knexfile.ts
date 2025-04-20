// Update with your config settings.
import { Knex } from 'knex'

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

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
    client: 'postgresql',
    connection: {
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: './migrations',
    },
  },
}

export default config
