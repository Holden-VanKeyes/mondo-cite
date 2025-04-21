import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('citations', (table) => {
    // Track whether this citation has been shared with anyone
    table.boolean('is_shared').defaultTo(false)
    // For quick filtering purposes
    table.integer('share_count').defaultTo(0)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('citations', (table) => {
    table.dropColumn('is_shared')
    table.dropColumn('share_count')
  })
}
