const express = require('express')
const app = express()
const cors = require('cors')
const diaryRouter = require('./controllers/diaries')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI



mongoose.set('strictQuery', false)

mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.use('/api/diary', diaryRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

module.exports= app