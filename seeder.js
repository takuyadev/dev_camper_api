const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./model/Bootcamp')
const Courses = require('./model/Courses')
const User = require('./model/User')

// Connect to database
mongoose.connect(process.env.MONGO_URI)

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));


// Import into DB
const importData = async () => {
   try {
      await Bootcamp.create(bootcamps)
      await Courses.create(courses)
      await User.create(users)
      console.log('Data imported...'.green.inverse)
   } catch (error) {
      console.error(error)
   }
   process.exit()
}

const deleteData = async () => {
   try {
      await Bootcamp.deleteMany()
      await Courses.deleteMany()
      await User.deleteMany()
      console.log('Data destroyed...'.red.inverse)
   } catch (error) {
      console.error(error)
   }
   process.exit()
}

if (process.argv[2] === '-i') {
   importData()
} else if (process.argv[2] === '-d') {
   deleteData()
}