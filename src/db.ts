import knex from 'knex'
import config from '../knexfile'
console.log('HIT')

const environment = process.env.NODE_ENV || 'development'
const db = knex(config[environment])

export default db
