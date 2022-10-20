const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const colors = require('colors')
const errorHandler = require('./middleware/error')

// Load env vars
dotenv.config({ path: './config/config.env' })
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps')
const app = express()

// Body Parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

// ? Small example on how to use a logger
// const logger = (req, res, next) => {
//    req.hello = "World"
//    console.log('Middleware Ran')
//    next()
// }

// Mount routers
app.use('/api/v1/bootcamps', bootcamps)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold))

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
   console.log(`Error ${err.message}`.red);
   // Close server & exit process
   server.close(() => process.exit(1))
})