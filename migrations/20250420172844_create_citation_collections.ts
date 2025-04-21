import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create citation_collections join table (many-to-many relationship)
  await knex.schema.createTable('citation_collections', (table) => {
    table
      .uuid('citation_id')
      .references('id')
      .inTable('citations')
      .onDelete('CASCADE')
    table
      .uuid('collection_id')
      .references('id')
      .inTable('collections')
      .onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    // Composite primary key to ensure a citation can only be added to a collection once
    table.primary(['citation_id', 'collection_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('citation_collections')
}
