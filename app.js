const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const multipart = multer().none();

const indexRouter = require('./routes/index.router'); 
const signupRouter = require('./routes/signup.router');
const loginRouter = require('./routes/login.router')
const companyRouter = require('./routes/company.router');
const tokenService = require("./services/token.service");
const userRoute = require("./routes/user.router");
const profileRoute = require("./routes/profile.router");
const authController = require("./controller/auth.controller");
const logoutRoute = require("./routes/logout.router");
const { application } = require('express');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multipart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',indexRouter);
app.use('/api/signup',signupRouter);
app.use('/api/login',loginRouter);

//implementing api security
app.use((req,res,next) => {
  const token = tokenService.verify(req);
  if(token.isVerified) {
    //user verified
    next();
  }
  else{
    //user not verified
    res.clearCookie("authToken");
    res.status(401); //token not verified
    res.redirect("/");
  }
});

const autoLogger = ()=>{
  return async (req,res,next)=>{ 
    const isLogged = await authController.checkUserLog(req,res);
    if(isLogged){
      next();
    }else{
      res.clearCookie("authToken");
      res.redirect("/");
    }
  }
}
app.use('/api/private/company',companyRouter);
app.use('/api/private/user',userRoute);
app.use('/logout',logoutRoute);
app.use('/profile',autoLogger(),profileRoute);

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
  res.send(err.message);
});

module.exports = app;
