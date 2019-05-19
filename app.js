var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var config = require('config');
const Mongoose = require('mongoose');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pollRouter = require('./routes/poll');

// variables
const mongoUri = config.get('mongoUri');

// Connecting to DB
Mongoose.connect(mongoUri, { useNewUrlParser: true })
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log('error connecting to DB'));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/poll', pollRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

const port = 3000;

app.listen(port, () => {
    console.log("Application starts at 3000");
})

module.exports = app;