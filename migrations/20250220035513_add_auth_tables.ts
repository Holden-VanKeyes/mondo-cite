import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Users table
  // await knex.schema.createTable('users', (table) => {
  //   table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
  //   table.string('email').notNullable().unique()
  //   table.string('name')
  //   table.timestamp('emailVerified')
  //   table.string('image')
  //   table.string('institution')
  //   table.enum('plan', ['free', 'premium', 'institutional']).defaultTo('free')
  //   table.integer('citation_count').defaultTo(0)
  //   table.timestamps(true, true)
  // })

  // Accounts table
  await knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table
      .uuid('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('type').notNullable()
    table.string('provider').notNullable()
    table.string('providerAccountId').notNullable()
    table.text('refresh_token')
    table.text('access_token')
    table.bigint('expires_at')
    table.string('token_type')
    table.string('scope')
    table.text('id_token')
    table.string('session_state')
    table.timestamps(true, true)

    table.unique(['provider', 'providerAccountId'])
  })

  // Sessions table
  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table
      .uuid('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.timestamp('expires').notNullable()
    table.string('sessionToken').notNullable().unique()
    table.timestamps(true, true)
  })

  // Verification tokens table
  await knex.schema.createTable('verificationTokens', (table) => {
    table.string('identifier').notNullable()
    table.string('token').notNullable()
    table.timestamp('expires').notNullable()
    table.timestamps(true, true)

    table.unique(['identifier', 'token'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('verificationTokens')
  await knex.schema.dropTableIfExists('sessions')
  await knex.schema.dropTableIfExists('accounts')
  await knex.schema.dropTableIfExists('users')
}
