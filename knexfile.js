const path = require('path')

module.exports = {
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: '127.0.0.1',
      user: 'conference',
      password: 'password',
      database: 'conference-test'
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'test', 'db', 'seeds')
    }
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: '127.0.0.1',
      user: 'conference',
      password: 'password',
      database: 'conference'
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds', 'development')
    }
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds')
    }
  }
}
