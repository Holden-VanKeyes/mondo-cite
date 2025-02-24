import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('email').notNullable().unique()
    table.string('name')
    table.timestamp('emailVerified')
    table.string('image')
    table.string('institution')
    table.enum('plan', ['free', 'premium', 'institutional']).defaultTo('free')
    table.integer('citation_count').defaultTo(0)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users')
}
