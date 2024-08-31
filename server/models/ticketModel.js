const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ticketObject = new Schema({
    ticketTitle : {
        type:String,

    },
    ticketDescription:{
        type:String
    },
    isResolved:{
        type:Boolean,
        default:false
    },
    date:{
        type: Date,
        default:new Date()
    },
    isClosed:{
        type:Boolean,
        default:false

    },
    userkind:{
        type:String,
        default:"na"
        
    },
    userid:{
        type:String,
    }
})
const Ticket = mongoose.model("Ticket",ticketObject)
module.exports = Ticket