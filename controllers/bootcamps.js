const Bootcamp = require('../model/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
   let query;

   // Copy req.query
   const reqQuery = { ...req.query }

   // Fiels to exclude
   const removeFields = ['select, sort']

   // Loop over remove fields and delete them from reqQuery
   removeFields.forEach(param => delete reqQuery[param])
   console.log(reqQuery)

   // Create query string
   let queryStr = JSON.stringify(req.query)

   // Create operators ($gt, $gte, etc.)
   queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

   // Finding resources
   query = Bootcamp.find(JSON.parse(queryStr))

   // Select fields
   if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query.select(fields)
   }

   // Sort
   if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
   } else {
      query = query.sort('-createdAt')
   }

   // Executing Query
   const bootcamp = await query

   console.log(queryStr)
   res
      .status(201)
      .json({
         success: true,
         count: bootcamp.length,
         data: bootcamp
      })
})

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findById(req.params.id)

   if (!bootcamp) {
      return next(next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)))
   }

   res
      .status(201)
      .json({ success: true, data: bootcamp })
})

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.create(req.body)

   if (!bootcamp) {
      return next(next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)))
   }

   res
      .status(201)
      .json({ success: true, msg: bootcamp })
})

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
   })

   if (!bootcamp) {
      res.status(400).json({ success: false })
   }

   res
      .status(200)
      .json({ success: true, data: bootcamp })
})

// @desc    DELETE bootcamp
// @route   DELETE /api/v1/bootcamps
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id)

   if (!bootcamp) {
      return next(next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)))
   }

   res
      .status(200)
      .json({ success: true, data: {} })

})

// @desc    GET bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:radius/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
   const { zipcode, distance } = req.params

   // Get lat/lng from geocoder
   const loc = await geocoder.geocode(zipcode)
   const lat = loc[0].latitude
   const lng = loc[0].longitude

   // Calc radius using radians
   // Divide distance by radius of Earth
   // Earth radius = 3,963 mi / 6,378 km
   const radius = distance / 3963;
   const bootcamps = await Bootcamp.find({
      location: {
         $geoWithin: {
            $centerSphere: [[lng, lat], radius]
         }
      }
   })
   res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
   })
})