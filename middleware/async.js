// Callsback the controller function
// If promise is not resolved, try catching error

const asyncHandler = fn => (req, res, next) =>
   Promise.resolve(fn(req, res, next)).catch(next)

module.exports = asyncHandler
