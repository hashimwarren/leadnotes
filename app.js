const express = require('express')
const exphbs  = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

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

//Method Overrise middleware
app.use(methodOverride('_method'))


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

//Notes index page
app.get('/notes', (req, res) => {
    //Bring in Leads model and use find methof
    Lead.find({})
        .sort({date:'desc'})
        .then(notes => {
            res.render('notes/index', {
                notes: notes
            })

    })


})

//Add Notes form
app.get('/notes/add', (req, res) => {
    res.render('notes/add')
})

//Edit Notes form
//Use parameter in URL - 'id' - to select single record
app.get('/notes/edit/:id', (req, res) => {
    Lead.findOne({
        //get the id and pass it into the object
        _id: req.params.id
    })
    .then(lead => {
        res.render('notes/edit', {
            lead:lead
        })
    } )

})

//Process form
app.post('/notes', (req, res, next) => {
    let errors = []
    if (!req.body.name) {
        errors.push({text: 'Please add a name'})
    }
    if (!req.body.notes) {
        errors.push({text: 'Please add a note'})
    }
    if (errors.length > 0) {
        res.render('notes/add', {
            errors: errors,
            name: req.body.name,
            notes: req.body.notes
        })
    }
    else {
        const newUser = {
          name: req.body.name,
          notes: req.body.notes
        }
        new Lead(newUser)
          .save()
          .then(lead => { //TODO double check if "idea" should be here
            res.redirect('/notes');
          })
          .catch(next)
      }

})

//Edit form process
app.put("/notes/:id", (req, res) => {
    Lead.findOne({
        _id: req.params.id
    })
    .then(lead => {
        //new values
        lead.name = req.body.name;
        lead.notes = req.body.notes;

        lead.save()
            .then(lead => {
                res.redirect('/notes')
            })
    })

})

//Delete Idea
app.delete('/notes/:id', (req, res) => {
    Lead.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/notes')
        })

})

const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})