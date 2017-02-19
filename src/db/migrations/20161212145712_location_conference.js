exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('locations', function (table) {
      table.uuid('id').notNullable().primary()
      table.string('title').notNullable().unique()
      table.text('description')
      table.string('address_1')
      table.string('address_2')
      table.string('town')
      table.string('county')
      table.string('zipcode')
      table.string('country')
    }),
    knex.schema.createTable('conferences', function (table) {
      table.uuid('id').notNullable().primary()
      table.string('title').notNullable().unique()
      table.text('description')
      table.string('organiser').notNullable().unique()
      table.dateTime('startTime')
      table.dateTime('endTime')
      table.uuid('location').references('locations.id')
    })
  ])
}

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('conferences'),
    knex.schema.dropTable('locations')
  ])
}
