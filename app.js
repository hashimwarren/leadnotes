const express = require('express')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const app = express()

//Map global promise - get rid of warning
mongoose.Promise = global.Promise

//Connect to Mongoose
mongoose.connect('mongodb://localhost/leadnotes-dev', {
    useMongoClient: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))

//Load Leads model
require('./models/Lead')
const Lead = mongoose.model('leads')


//the Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Index route
app.get('/', (req, res) => {
    const title = 'Welcome Alex!'

    res.render('index', {
        title: title
    })
})

// About route
app.get('/about', (req, res) => {
    res.render('about')
})

//Add Notes form
app.get('/notes/add', (req, res) => {
    res.render('notes/add')
})

//Process form
app.post('/notes', (req, res) => {
    let errors = []
    if (!req.body.name) {
        errors.push({text: 'Please add a name'})
    }
    if (!req.body.note) {
        errors.push({text: 'Please add a note'})
    }
    if (errors.length > 0) {
        res.render('notes/add', {
            errors: errors,
            name: req.body.name,
            note: req.body.note
        })
    }
    else {
        res.send('passed')
        console.log(req.body.name)

    }

})


const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})