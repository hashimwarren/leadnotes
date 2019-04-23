const express = require('express')
const path = require('path')
const exphbs  = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')

const app = express()

//Load routes
const notes = require('./routes/notes')
const users = require('./routes/users')

//Passport config
require('./config/passport')(passport)

//Map global promise - get rid of warning
mongoose.Promise = global.Promise

//Connect to Mongoose
//TODO check out babel
mongoose.connect('mongodb://localhost/leadnotes-dev', {
    //useMongoClient: true
    useNewUrlParser: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))




//the Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Method Overrise middleware
app.use(methodOverride('_method'))

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

// Connect Flash
app.use(flash())

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()

})

//Index route
app.get('/', (req, res) => {
    const title = 'LeadNotes 0.3'

    res.render('index', {
        title: title
    })
})

// About route
app.get('/about', (req, res) => {
    res.render('about')
})


//Use routes
app.use('/notes', notes)
app.use('/users', users)

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})