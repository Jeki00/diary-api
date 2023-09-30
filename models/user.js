const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        minLength: 3,
        unique:true,
        required: true,
    },
    password : String,
    fullname:String,
    diary:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Diary'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

    }
})

module.exports = mongoose.model('User', userSchema);