// Update with your config settings.
import { Knex } from 'knex'

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
// module.exports = {

//   development: {
//     client: 'sqlite3',
//     connection: {
//       filename: './dev.sqlite3'
//     }
//   },

//   staging: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }

// };
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
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },
}

export default config

// import type { Knex } from 'knex'

// // Update with your config settings.
// console.log('ENV FROM HEROKU', process.env.DATABASE_URL)

// const dev = process.env.NODE_ENV === 'development'
// const config: Knex.Config = {
//   client: 'pg',
//   connection: dev
//     ? {
//         host: '0.0.0.0',
//         port: 5432,
//         database: 'postgres',
//       }
//     : {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//       },
//   migrations: {
//     extension: 'ts',
//   },
// }

// export default config
