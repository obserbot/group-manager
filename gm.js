// app.js

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const exeCommand = require('./gm_modules/exe_command')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// bot

const { Wechaty } = require('wechaty')
const { ScanStatus } = require('wechaty-puppet')
const { PuppetPadplus } = require('wechaty-puppet-padplus')
const QrcodeTerminal = require('qrcode-terminal')

// Configure .env
require('dotenv').config()

const ADMIN_WXID = process.env.ADMIN_WXID
const token = process.env.TOKEN
const name = 'gmbot'

const puppet = new PuppetPadplus({
  token,
})

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})


bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true
      })
    }
  })
  .on('message', async msg => {

    if (msg.payload.roomId) {
      console.log('from romm: ', msg.payload.roomId)
    }
    else if (msg.payload.fromId === ADMIN_WXID) {
      const result = exeCommand(msg)
    }
    else {
      console.log('Abandoned the message.')
    }

  })
  .start()

module.exports = app;
