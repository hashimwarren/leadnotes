const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LeadSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    notes:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

mongoose.model('leads', LeadSchema)