const express = require('express')
const { getBootcamp, getBootcamps, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius } = require('../controllers/bootcamps')
const router = express.Router()

router
   .route('/')
   .get(getBootcamps)
   .post(createBootcamp)


router.route('/:id')
   .get(getBootcamp)
   .put(updateBootcamp)
   .delete(deleteBootcamp)

router.route('/radius/:zipcode/:distance')
   .get(getBootcampsInRadius)

// router.get('/', (req, res) => {
//    res.send({ name: "Brad" })
// })

// router.get('/', (req, res) => {
//    res.send({ success: true, msg: 'Show all bootcamps' })
// })

// router.get('/:id', (req, res) => {
//    res.status(200).json({ success: true, msg: `Show bootcamp at ${req.params.id}` })
// })

// router.post('/', (req, res) => {
//    res.send({ success: true, msg: 'Create new bootcamp' })
// })

// router.put('/:id', (req, res) => {
//    res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` })
// })

// router.delete('/:id', (req, res) => {
//    res.status(200).json({ success: true, msg: `Delete bootcamp at ${req.params.id}` })
// })

module.exports = router