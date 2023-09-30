const diaryRouter = require('express').Router()
const Diary = require('../models/diary')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')



function verifyToken(req, res, next) {
    const authorization = req.get('authorization')
    const token = authorization && authorization.toLowerCase().startsWith('bearer ') 
        ? authorization.substring(7)
        : null

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            } else if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            } else {
                return res.status(500).json({ message: 'Internal server error' });
            }
        }

        req.decodedToken = decodedToken;
        next();
    });
}


diaryRouter.get('',verifyToken,async (req,res)=>{
    const found = await Diary.find({user:req.decodedToken.id})
    if(found.length < 1){
        return res.status(404).json({error:"Not Found"})
    }
    return res.status(200).json(found)
})


diaryRouter.post('', verifyToken,async (req,res)=>{
    
    const newDiary = new Diary({
        title:req.body.title,
        content:req.body.content,
        date:new Date(),
        user:req.decodedToken.id
    })
    
    try {
        const savedDiary = await newDiary.save()
        const user = await User.findById(req.decodedToken.id)

        user.diary = user.diary.concat(savedDiary.id)
        await user.save()

        return res.status(201).json(savedDiary)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(422).json({error: error.message})
        } else {
            return res.status(400).json({error: error.message})
        }
    }

})

diaryRouter.delete('/:id',verifyToken, async (req,res)=>{
    
    const diaryId = req.params.id
    const foundDiary = await Diary.findById(diaryId)

    
    if(foundDiary === null){
        return res.status(404).json({error:"not found"})
    }
    if(foundDiary.user == req.decodedToken.id){
        await Diary.findByIdAndDelete(diaryId)

        return res.status(200).json({message:"success"})
    }else{
        return res.status(401).json({error:"unauthorized"})
    } 

})



module.exports = diaryRouter