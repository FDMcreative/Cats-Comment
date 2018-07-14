// require modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('express-flash'); //it must come after the sessions cause they rely on session cookies, check below
const routes = require('./config/routes');
const User = require('./models/user');
const customResponses = require('./lib/customResponses');
const authenticationUser = require('./lib/authenticationUser');
const errorHandler = require('./lib/errorHandler');

const {port, env, dbURI, sessionSecret} = require('./config/environment');

//setup express app
const app = express();

//set up template engine
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);
app.use(expressLayouts);

//set up static folder
app.use(express.static(`${__dirname}/public`));

//set up database
mongoose.connect(dbURI, {useNewUrlParser: true });

//set up middleware
if(env !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(methodOverride(function (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

//set up session
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

//set up flash messages AFTER session
// (cause it stores the messages in session)
app.use(flash());

//set up custom middleware Lib Folder
app.use(authenticationUser);
app.use(customResponses);
//set up routes
// (just before error handler)
app.use(routes);

//set up error error handler - to catch 500 error, send message to user and keep server running and avoid crashes
// (always the LAST middleware just before listen)
app.use(errorHandler);

app.listen(port, () => console.log(`Express is listening on port ${port}`));
