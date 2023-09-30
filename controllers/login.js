const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('', async (req,res)=>{
    const {username, password} = req.body
    const foundUser = await User.findOne({username})

    const passwordCorrect = foundUser === null
    ? false
    : await bcrypt.compare(password, foundUser.password)

    if(!(foundUser && passwordCorrect)){
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }
    const userForToken = {
        username:foundUser.username,
        id:foundUser._id
    }

    const token = await jwt.sign(userForToken, process.env.SECRET)

    return res.status(201).json({
        token, 
        username:foundUser.username,
        fullname:foundUser.fullname,
        id: foundUser.id
    })
})

module.exports = loginRouter
