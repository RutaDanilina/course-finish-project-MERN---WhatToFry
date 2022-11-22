const express = require('express')
const {check} = require('express-validator')


const usersControllers = require('../controllers/users-controllers')
const fileUpload = require('../middleware/file-upload-middleware')

const router = express.Router()

router.get('/', usersControllers.getAllUsers)

router.post('/register',fileUpload.single('image'),[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
], usersControllers.registerUser)

router.post('/login', usersControllers.loginUser)


module.exports = router