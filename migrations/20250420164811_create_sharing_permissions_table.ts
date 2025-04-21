import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sharing_permissions', (table) => {
    table.increments('id').primary()
    // Change integer to uuid to match the citations table
    table.uuid('citation_id').notNullable()
    // If your users table also uses uuid, update these as well
    table.uuid('shared_by').notNullable()
    table.uuid('shared_with').notNullable()
    table
      .enu('permission_level', ['read-only', 'can_edit', 'can_delete'])
      .defaultTo('read-only')
    table.timestamps(true, true)

    // Foreign keys
    table.foreign('citation_id').references('citations.id').onDelete('CASCADE')
    table.foreign('shared_by').references('users.id').onDelete('CASCADE')
    table.foreign('shared_with').references('users.id').onDelete('CASCADE')

    // Ensure uniqueness - prevent duplicate sharing entries
    table.unique(['citation_id', 'shared_with'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('sharing_permissions')
}
