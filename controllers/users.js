const userRouter = require('express').Router()
const User = require('../models/user')
const Diary = require('../models/diary')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

userRouter.post('', async (req,res)=>{
    const {username, password, fullname} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const foundUser  = await User.findOne({username})
    if(foundUser){
        return res.status(409).json({error:"username already exist"})
    }
    const newUser = new User({
        username:username,
        password: hashedPassword,
        fullname:fullname
    })

    try {
        const savedUser = await newUser.save()
        return res.status(201).json(savedUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).json({error: error.message})
        } else {
            return res.status(400).json({error: error.message})
        }
    }

})

userRouter.delete('/:id', async(req,res)=>{
    const userId = req.params.id

    const deletedUser = await User.findByIdAndDelete(userId)

    const foundDiary = await Diary.find({user:userId})

    

    foundDiary.map(async (diary)=> await Diary.findByIdAndDelete(diary._id))

    if(deletedUser===null){
        return res.status(404).json({error:"not found"})
    }

    return res.status(200).json({message:"succes"})
    
})


module.exports = userRouter