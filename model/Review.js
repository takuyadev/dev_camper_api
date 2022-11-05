const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
   title: {
      type: String,
      trim: true,
      required: [true, 'Please add a title for the review'],
      maxlength: 100
   },
   text: {
      type: String,
      required: [true, 'Please add some text']
   },
   rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Please add a review rating"]
   },
   bootcamp: {
      type: mongoose.Schema.ObjectId,
      // Reference to Schema, not database
      ref: 'Bootcamp',
      required: true
   },
   user: {
      type: mongoose.Schema.ObjectId,
      // Reference to Schema, not database
      ref: 'User',
      required: true
   }
})

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true })

// static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
   const obj = await this.aggregate(
      [
         {
            $match: { bootcamp: bootcampId }
         },
         {
            $group: {
               _id: '$bootcamp',
               averageRating: { $avg: '$rating' }
            }
         }
      ]
   )
   try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
         averageRating: obj[0].averageRating
      })
   } catch (err) {
      console.error(err)
   }
}

// Call getAverageRating after save
ReviewSchema.post('save', async function () {
   await this.constructor.getAverageRating(this.bootcamp)
})

// Call getAverageRating before remove
ReviewSchema.pre('remove', async function () {
   await this.constructor.getAverageRating(this.bootcamp)
})


module.exports = mongoose.model('Review', ReviewSchema)