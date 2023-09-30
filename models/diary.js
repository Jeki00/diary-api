const mongoose = require('mongoose')


const diarySchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    content : {
        type:String,
        required: true
    },
    date:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

diarySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})

module.exports = mongoose.model('Diary', diarySchema);