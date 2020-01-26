var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session=require("express-session")
var filmsrouter = require('./routes/films');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:"siddhant",resave:false,saveUninitialized:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(filmsrouter);

app.listen(8000);
console.log('listning at 8000');