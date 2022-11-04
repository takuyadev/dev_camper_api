const express = require('express')
const { getCourse, getCourses, addCourse, updateCourse, deleteCourse } = require('../controllers/courses')
const router = express.Router({ mergeParams: true });

const Courses = require('../model/Courses')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router.route('/')
   .get(advancedResults(Courses, {
      path: 'bootcamp',
      select: "name description"
   }), getCourses)
   .post(protect, authorize('publisher', 'admin'), addCourse)

router.route('/:id')
   .get(getCourse)
   .put(protect, authorize('publisher', 'admin'), updateCourse)
   .delete(protect, authorize('publisher', 'admin'), deleteCourse)


router.route('/bootcamps/:bootcampId/courses')
   .get(getCourses)
   .post(protect, authorize('publisher', 'admin'), addCourse)

module.exports = router