const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

//Load Leads model
require('../models/Lead')
const Lead = mongoose.model('leads')

//Notes index page
router.get('/', (req, res) => {
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
router.get('/add', (req, res) => {
    res.render('notes/add')
})

//Edit Notes form
//Use parameter in URL - 'id' - to select single record
router.get('/edit/:id', (req, res) => {
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
router.post('/', (req, res, next) => {
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
          req.flash('success_msg', 'Lead Note added')
          res.redirect('/notes');
          })
          .catch(next)
      }

})

//Edit form process
router.put("/:id", (req, res) => {
    Lead.findOne({
        _id: req.params.id
    })
    .then(lead => {
        //new values
        lead.name = req.body.name;
        lead.notes = req.body.notes;

        lead.save()
            .then(lead => {
                req.flash('success_msg', 'Lead Note updated')
                res.redirect('/notes')
            })
    })

})

//Delete Idea
router.delete('/:id', (req, res) => {
    Lead.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Lead note removed')
            res.redirect('/notes')
        })

})


//Export to make it visible
module.exports = router