const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/leadnotes-dev', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Lead');
const Lead = mongoose.model('leads');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Add Idea Form
app.get('/notes/add', (req, res) => {
  res.render('notes/add');
});

// Process Form
app.post('/notes', (req, res) => {
  let errors = [];

  if(!req.body.name){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.notes){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('notes/add', {
      errors: errors,
      name: req.body.name,
      notes: req.body.notes
    });
  } else {
    const newUser = {
      name: req.body.name,
      notes: req.body.notes
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/notes');
      })
  }
});

const port = 5070;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});