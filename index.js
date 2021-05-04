const express = require("express");
const exphbs = require("express-handlebars")
const flash = require("express-flash")
const cookie_parser = require("cookie-parser")
const session = require("express-session")
var jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 8080


// mongoDB_connection //
const mongoDB_connection = require("./mongoDB/mongoDB_connection")
mongoDB_connection()

// connect mongoDB session
const MongoDBSession = require('connect-mongodb-session')(session)
const store = new MongoDBSession({
    uri: 'mongodb+srv://junayedkhan:khan_0258@cluster0.sir31.mongodb.net/junayedkhan?retryWrites=true&w=majority',
    collection: 'my_sessions'
})

//######## midaleware start #########//

//handlebars
app.engine('.hbs', exphbs({
    extname: 'hbs'
}))
app.set('view engine', '.hbs')

// json
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// static folder
app.use(express.static('public'))

// flash massage
app.use(cookie_parser("keyboard cat"))
app.use(session({
    // cookie: { maxAge: 60000 },
    resave: false,
    secret: "my_secret",
    saveUninitialized: false,
    store
}))

app.use(flash())

//route handle
app.use('/', require("./route/main"))


app.listen(PORT, console.log("server start on " + PORT))