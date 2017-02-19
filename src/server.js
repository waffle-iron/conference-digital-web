const express = require('express')
const expressValidator = require('express-validator')
const app = express()
const bodyParser = require('body-parser')
const compression = require('compression')
const nunjucks = require('nunjucks')
const session = require('express-session')
const flash = require('express-flash')

const config = require('../config')
const filters = require('./lib/nunjuckfilters')
const customValidators = require('./lib/validators')
const customSanitizers = require('./lib/sanitizers')

const indexController = require('./controller/indexcontroller')
const locationController = require('./controller/locationcontroller')
const conferenceController = require('./controller/conferencecontroller')

const isDev = app.get('env') === 'development'

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(bodyParser.json({ limit: '1mb' }))
app.use(expressValidator({ customValidators, customSanitizers }))
app.use(flash())
app.use(compression())

app.set('view engine', 'html')
const nunenv = nunjucks.configure(`${__dirname}/views`, {
  autoescape: true,
  express: app,
  watch: isDev
})

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName])
})

app.use(express.static(`${__dirname}/public`))
app.use(express.static(`${__dirname}/../build`))
app.use(express.static(`${__dirname}/../node_modules/bootstrap/dist`))
app.use('/js', express.static(`${__dirname}/../node_modules/jquery/dist`))
app.use(express.static(`${__dirname}/../node_modules/tether/dist`))
app.use('/fonts', express.static(`${__dirname}/../node_modules/font-awesome/fonts`))

let sess = {
  secret: 'somethingsecret',
  cookie: {},
  resave: false,
  saveUninitialized: true
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

if (app.get('env') !== 'test') {
  app.use(session(sess))
}

// Insert useful variables into response for all controllers
app.use(require(`${__dirname}/middleware/locals`))

app.get('/', indexController.get)
app.get('/error', (req, res) => {
  res.render('error')
})

app.use('/locations', locationController.router)
app.use('/conferences', conferenceController.router)

app.listen(config.port)

module.exports = app
