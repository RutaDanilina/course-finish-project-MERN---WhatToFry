const HttpError = require('../models/http-error')
const {validationResult} = require('express-validator')
const fs = require('fs')

const Recipe = require('../schemas/recipeSchema')
const User = require('../schemas/userSchema')
const  mongoose = require('mongoose')

/////////////////////////////////////////////////////////////////
const getRecipeById = async(req, res, next) => {
  const recipeId = req.params.rid

  let recipe
  try {
    recipe = await Recipe.findById(recipeId)
  } catch(err) {
    return next(new HttpError('Could not find a recipe..', 500))
  }

  if (!recipe) {
    return next(new HttpError('Could not find a recipe for the provided id.', 404))
  }

  res.json({ recipe: recipe.toObject({ getters: true }) })
}

/////////////////////////////////////////////////////////////////
const getRecipesByUserId = async (req, res, next) => {
  const userId = req.params.uid

  let userWithRecipes
  try {
    userWithRecipes = await User.findById(userId).populate('recipes')
  } catch (err) {
    const error = new HttpError(
      'Fetching recipes failed, please try again later.',
      500
    )
    return next(error)
  }

  if (!userWithRecipes || userWithRecipes.recipes.length === 0) {
    return next(
      new HttpError('User has no recipes yet', 400)
    );
  }

  res.json({
    recipes: userWithRecipes.recipes.map(recipe =>
      recipe.toObject({ getters: true })
    )
  });
};

/////////////////////////////////////////////////////////////////
const createRecipe = async (req, res, next) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return next(new HttpError('Fields must be filled', 400))
  }

  const { title, description, address } = req.body

  const createdRecipe = new Recipe({
    title,
    description,
    address,
    image: req.file.path,
    creator: req.userData.userId
  })

  let user
  try {
    user= await User.findById(req.userData.userId)
  } catch (err) {
    return next(new HttpError('Creating recipe failed, please try again later', 500))
  }

  if(!user) {
    return next(new HttpError('No user for provided ID', 404))
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdRecipe.save({session: sess})
    user.recipes.push(createdRecipe)
    await user.save({ session: sess})
    await sess.commitTransaction()

  } catch(err) {
    return next(new HttpError('Creating recipe failed.. Please try again', 500))
  }

  res.status(201).json({recipe: createdRecipe})
}

/////////////////////////////////////////////////////////////////
const updateRecipeById = async(req,res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 400))
  }

  const { title, description } = req.body
  const recipeId = req.params.rid

  let recipe
  try {
    recipe = await Recipe.findById(recipeId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update recipe.',
    500))
  }

  if (recipe.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this recipe.', 400))
  }

  recipe.title = title
  recipe.description = description

  try {
    await recipe.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update recipe.',
    500))
  }

  res.status(200).json({ recipe: recipe.toObject({ getters: true }) })
}

/////////////////////////////////////////////////////////////////
const deleteRecipeById = async(req,res, next) => {
  const recipeId = req.params.rid

  let recipe
  try {
    recipe = await Recipe.findById(recipeId).populate('creator')
  } catch(err) {
    return next(new HttpError('Something went wrong, could not delete recipe', 500))
  }

  if(!recipe){
    return next(new HttpError('Could not find recipe for this ID', 404))
  }

  const imagePath = recipe.image

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await recipe.remove({session: sess})
    recipe.creator.recipes.pull(recipe)
    await recipe.creator.save({session: sess})
    await sess.commitTransaction()
  }catch(err) {
    return next(new HttpError('Something went wrong, could not delete recipe', 500))
  }
  
  fs.unlink(imagePath, err => console.log(err))

  res.status(200).json({message : 'Recipe deleted'})
}


exports.getRecipeById = getRecipeById
exports.getRecipesByUserId = getRecipesByUserId
exports.createRecipe = createRecipe
exports.updateRecipeById = updateRecipeById
exports.deleteRecipeById = deleteRecipeById

