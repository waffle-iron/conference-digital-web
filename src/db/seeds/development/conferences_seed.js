
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('conferences').del()
    .then(() => {
      return knex('locations').del()
    })
    .then(() => {
      return knex('locations').insert({
        id: '35b6db3e-515c-4497-8020-3b1aea0c5956',
        title: 'QE2 Conference Hall 1',
        description: 'The main conference hall at the QE2 Conference center',
        address_1: 'QE Conference Center',
        address_2: '',
        town: 'London',
        county: '',
        zipcode: 'WC1 1WC',
        country: 'United Kingdom'
      })
    })
    .then(() => {
      return knex('conferences').insert({
        id: '74e235bd-0119-45a0-8445-d63f0aef655c',
        title: 'Save the childred',
        description: 'Just think about the children',
        organiser: 'Zac Tolley',
        startTime: new Date(2016, 1, 1, 10, 0, 0),
        endTime: new Date(2016, 1, 1, 16, 0, 0),
        location: '35b6db3e-515c-4497-8020-3b1aea0c5956'
      })
    })
}
