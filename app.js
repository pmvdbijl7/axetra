require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

// Get .env variables
const hostURL = process.env.URL;
const hostPort = process.env.PORT || 3030;
const dbConnection = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.bnxec4v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Set templating engine
app.set('view engine', 'ejs');

// Set public directory as a static directory
app.use(express.static('public'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(session ({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Connect to database
mongoose.connect(dbConnection);
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', () => {
    console.log('Succesfully connected to database!')
});

// Show 404 page if page doesn't exist
app.use((req, res, next) => {
    res.status(404).send('This page does not exist!');
});

app.listen(hostPort, () => {
    console.log(`App listening at ${hostURL}:${hostPort}`);
});