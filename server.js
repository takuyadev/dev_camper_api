const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')

// Load env vars
dotenv.config({ path: './config/config.env' })
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const app = express()

// Body Parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// ? Small example on how to use a logger
// const logger = (req, res, next) => {
//    req.hello = "World"
//    console.log('Middleware Ran')
//    next()
// }

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold))

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
   console.log(`Error ${err.message}`.red);
   // Close server & exit process
   server.close(() => process.exit(1))
})

