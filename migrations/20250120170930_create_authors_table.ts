import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // authors table
  await knex.schema.createTable('authors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('middle_name')
    table.string('affiliation')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('authors')
}
