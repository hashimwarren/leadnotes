const express = require('express')
const app = express()
const exphbs  = require('express-handlebars')

//the Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Index route
app.get('/', (req, res) => {

    res.send('INDEX!')
})

// About route
app.get('/about', (req, res) => {
    res.send('All about King Hashim!')
})


const port = 5000;
app.listen(port, () => {
    console.log(`Server started on ${port}`)
})