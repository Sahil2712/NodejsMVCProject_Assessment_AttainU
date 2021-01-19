const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
var imageFunc = require('./middleware/image');
const cookieParser = require('cookie-parser');
// Load config
dotenv.config({ path: './config/.env' })
const app = express()
// Database Connection Method
connectDB();


// Port Number
const PORT = process.env.PORT || 3000

app.listen(
  PORT,
  console.log(`Server running in development mode on port ${PORT}`)
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser());

// Routers
app.use('/users',require('./routes/UserRouter'));

module.exports = app;
