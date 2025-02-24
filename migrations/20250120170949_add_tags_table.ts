import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // tags table
  await knex.schema.createTable('tags', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable()
    table
      .uuid('user_id')
      .references('uuid')
      .inTable('users')
      .onDelete('CASCADE')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tags')
}
