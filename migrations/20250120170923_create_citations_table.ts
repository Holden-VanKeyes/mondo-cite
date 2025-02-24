import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Users table
  await knex.schema.createTable('citations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('title').notNullable()
    table.string('journal')
    table.integer('year')
    table.string('volume')
    table.string('issue')
    table.string('pages')
    table.string('doi')
    table.string('url')
    table.text('abstract')
    table
      .uuid('user_id')
      .references('uuid')
      .inTable('users')
      .onDelete('CASCADE')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('citations')
}
