import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  //citation tags table
  await knex.schema.createTable('citation_tags', (table) => {
    table
      .uuid('citation_id')
      .references('id')
      .inTable('citations')
      .onDelete('CASCADE')
    table.uuid('tag_id').references('id').inTable('tags').onDelete('CASCADE')
    table.primary(['citation_id', 'tag_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('citation_tags')
}
