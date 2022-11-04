const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../model/User')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
   let token
   console.log(req.headers.authorization)

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
   }

   // Set token from cookie

   // else if (req.cookies.token) {
   //    token = req.cookies.token
   // }

   // Make sure token exists

   if (!token) {
      return next(new ErrorResponse(`Not authorized to access this route`, 404))
   }

   try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      console.log(decoded)

      req.user = await User.findById(decoded._id)

      next();
   } catch (err) {
      return next(new ErrorResponse(`Not authorized to access this route`, 404))
   }
})


// Grant access to specific roles
exports.authorize = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403))
      }
      next()
   }
} 