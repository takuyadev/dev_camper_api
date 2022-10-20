const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./model/Bootcamp')

// Connect to database
mongoose.connect(process.env.MONGO_URI)

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

// Import into DB
const importData = async () => {
   try {
      await Bootcamp.create(bootcamps)
      console.log('Data imported...'.green.inverse)
   } catch (error) {
      console.error(error)
   }
   process.exit()
}

const deleteData = async () => {
   try {
      await Bootcamp.deleteMany()
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