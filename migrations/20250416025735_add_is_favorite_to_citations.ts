import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('citations', function (table) {
    table.boolean('isFavorite').notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('citations', function (table) {
    table.dropColumn('isFavorite')
  })
}
