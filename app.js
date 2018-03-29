require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const cors = require('cors');
const user = require('./routes/user-routes');
const restaurant = require('./routes/restaurant-routes');
const order = require('./routes/order-routes');
const address = require('./routes/address-routes');

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log(`Connected to DB: ${process.env.MONGO_URI}`);
});


// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
const whitelist = ['http://localhost:8100'];
const corsOptions = {
  origin(origin, callback) {
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

require('./passport')(app);

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/restaurant', restaurant);
app.use('/api/order', order);
app.use('/api/address', address);

// app.use((req, res) => {
//   res.sendfile(`${__dirname}/public/index.html`);
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
