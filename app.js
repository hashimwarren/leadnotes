const express = require('express')
const exphbs  = require('express-handlebars')
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


const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})