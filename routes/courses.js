const express = require('express')
const { getCourse, getCourses, addCourse, updateCourse, deleteCourse } = require('../controllers/courses')
const router = express.Router({ mergeParams: true });

const Courses = require('../model/Courses')
const advancedResults = require('../middleware/advancedResults')

router.route('/')
   .get(advancedResults(Courses, {
      path: 'bootcamp',
      select: "name description"
   }), getCourses)
   .post(addCourse)

router.route('/:id')
   .get(getCourse)
   .put(updateCourse)
   .delete(deleteCourse)


router.route('/bootcamps/:bootcampId/courses')
   .get(getCourses)
   .post(addCourse)

module.exports = router