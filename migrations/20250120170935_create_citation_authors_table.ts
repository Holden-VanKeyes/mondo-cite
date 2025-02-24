import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // citation_authors table
  await knex.schema.createTable('citation_authors', (table) => {
    table
      .uuid('citation_id')
      .references('id')
      .inTable('citations')
      .onDelete('CASCADE')
    table
      .uuid('author_id')
      .references('id')
      .inTable('authors')
      .onDelete('CASCADE')
    table.primary(['citation_id', 'author_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('citation_authors')
}
