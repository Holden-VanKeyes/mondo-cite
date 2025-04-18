import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('citations', function (table) {
    table.string('source').nullable() // Publication name
    table.string('type').nullable() // Citation type (journal, book, etc.)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('citations', function (table) {
    table.dropColumn('source')
    table.dropColumn('type')
  })
}
