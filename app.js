var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
// var usersRouter = require('./routes/users');
var dashboardRouter = require('./routes/dashboard')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', require('express-ejs-extend'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
var session = require('express-session')
var flash = require('connect-flash')

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 100 * 1000 }
  })
)
app.use(flash())

//暫時不用
const authChecker = function (req, res, next) {
  console.log('middleware', req.session)
  if (req.session.uid === process.env.ADMIN_UID) {
    return next()
  }
  return res.redirect('/auth/signin')
}

app.use('/', indexRouter)
app.use('/dashboard', dashboardRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  res.render('error',{
    title:'您所查看的頁面不存在'
  })
  // next(err)
  // next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
