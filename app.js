var createError = require('http-errors');

//引入express包
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//引入用户路由器
var indexRouter = require('./routes/index');/* 暂时不用 */
var usersRouter = require('./routes/user.js');
//引入上传upload.js
var upload = require('./upload.js');
//引入body-parser中间件 
// 已知在express4.16.0以上版本，express内置了基于bodyParser的中间件，并且可以替代bodyParser
// const bodyParser=require('body-parser');
//创建web服务器
var app = express();
//设置端口
app.listen(8080);
//托管静态资源到public目录
app.use( express.static('./public') );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
//使用body-parser中间件将post请求数据解析为对象
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);/* 暂时不用 */
app.use('/user', usersRouter);

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

module.exports = app;
