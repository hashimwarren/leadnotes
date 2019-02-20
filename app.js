const express = require('express')
const app = express()
const exphbs  = require('express-handlebars')

//the Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Index route
app.get('/', (req, res) => {
    const me = {
        fname: 'Hashim',
        lname: 'Warren',
        age: '38',
        height: '5 foot 10',
        weight: '360 lbs'
    }

    res.render('index', {
        me.fname: fname,
        me.lname: lname
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