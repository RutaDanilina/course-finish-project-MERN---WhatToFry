const express = require('express')

const authMiddleware = require('../middleware/auth-middleware')
const {check} = require('express-validator')
const fileUpload = require('../middleware/file-upload-middleware')

const recipesControllers = require('../controllers/recipes-controllers')

const router = express.Router()


router.get('/:rid', recipesControllers.getRecipeById)

router.get('/user/:uid', recipesControllers.getRecipesByUserId)

router.use(authMiddleware)

router.post('/', fileUpload.single('image') ,[
    check('title').not().isEmpty(),
    check('description').isLength({min:6}),
    check('address').not().isEmpty() 
] , recipesControllers.createRecipe)

router.patch('/:rid', [
    check('title').not().isEmpty(),
    check('description').isLength({min:5})
], recipesControllers.updateRecipeById)

router.delete('/:rid', recipesControllers.deleteRecipeById)



module.exports = router;