import knex from 'knex'
import config from '../knexfile'

const environment = process.env.NODE_ENV || 'development'
const db = knex(config[environment])
console.log('HIT', environment)

export default db
