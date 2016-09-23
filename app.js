'use strict';

const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const nunjucks = require('nunjucks');
const session = require('express-session');
const flash = require('express-flash');


const config = require('./config');
const filters = require('./app/lib/nunjuckfilters');
const customValidators = require('./app/lib/validators');
const customSanitizers = require('./app/lib/sanitizers');

const indexController = require('./app/controller/indexcontroller');
const loginController = require('./app/controller/logincontroller');
const locationsController = require('./app/controller/locationscontroller');
const conferencesController = require('./app/controller/conferencescontroller');

const isDev = app.get('env') === 'development';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({ customValidators, customSanitizers }));
app.use(flash());
app.use(compression());

app.set('view engine', 'html');
const nunenv = nunjucks.configure(`${__dirname}/app/views`, {
  autoescape: true,
  express: app,
  watch: isDev
});

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName]);
});


app.use(express.static(`${__dirname}/app/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use('/js', express.static(`${__dirname}/node_modules/jquery/dist`));
app.use(express.static(`${__dirname}/node_modules/tether/dist`));
app.use('/fonts', express.static(`${__dirname}/node_modules/font-awesome/fonts`));

var sess = {
  secret: 'somethingsecret',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));
app.use(require(`${__dirname}/app/middleware/auth`));





// Insert usefull variables into response for all controllers
app.use(require(`${__dirname}/app/middleware/locals`));

app.get('/', indexController.get);

app.get('/login', loginController.get);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
app.get('/error', (req, res) => {
  res.render('error');
});

app.use('/locations', locationsController.router);
app.use('/conferences', conferencesController.router);

app.listen(config.port);
