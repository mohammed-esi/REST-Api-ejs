const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const path = require('path');


// Init App
const app = express();


// Passport Config
require('./config/passport')(passport);


// Connect Database
mongoose.connect(config.database);

let db = mongoose.connection;


// Check Error Database
db.on('error', function (err) {
    console.log(err);
});
// Check Connect Database
db.once('open', function () {
    console.log('MongoDB is connect with server....');
});



// Express body parcer
app.use(express.urlencoded({ extended : true}));


// Express Session 
app.use(
    session({
      secret: 'secrte',
      resave: true,
      saveUninitialized: true
    })
  );


// Ejs 
app.use(expressLayouts);
app.set('view engine', 'ejs');



// Set Public Folder
app.use(express.static(path.join(__dirname, '')));



// Connect Flash 
app.use(flash());






// Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.articles = req.articles;
  res.locals.user = req.user ? req.user : null;
  next();
});




// Passport Middlwar
app.use(passport.initialize());
app.use(passport.session());




// User Global Variable
app.get('*', function (req, res ,next) {
  res.locals.user = req.user || null;
  next();
});






// Routes 
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users'));
app.use('/article', require('./routes/article'));







// Started Server
const PORT = process.env.Port || 5000;

app.listen(PORT, console.log('Server started on....' + PORT));