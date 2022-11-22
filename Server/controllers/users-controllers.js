const HttpError = require('../models/http-error')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

const User = require('../schemas/userSchema')

//////////////////////////////////////////////////////
const getAllUsers = async (req, res, next) => {
    let users
    try {
      users = await User.find({}, '-password')
    } catch (err) {
      return next(new HttpError('Fetching users failed, please try again later.', 500))
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))})
  }
  
  //////////////////////////////////////////////////////
  const registerUser = async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 400))
    }

    const { name, email, password } = req.body
  
    let existingUser
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again later.', 500))
    }
    
    if (existingUser) {
      return next(new HttpError('User exists already, please login instead.', 400))
    }
    
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch(err){
      return next(new HttpError('Could not create user, please try again later', 500))
    }

    const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      recipes: []
    })
  
    try {
      await createdUser.save()
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again.', 500))
    }
  
    let token
    try{
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email}, 
        'secret_token', 
        {expiresIn: '1h'}
      )
    } catch(err){
      return next(new HttpError('Signing up failed, please try again.', 500))
    }

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token})
  }
  
  
//////////////////////////////////////////////////////
  const loginUser = async (req, res, next) => {
    const { email, password } = req.body
  
    let existingUser
  
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      return next(new HttpError('Logging in failed, please try again later.', 500))
    }
  
    if (!existingUser) {
      return next(new HttpError('Invalid credentials, could not log you in.', 400))
    }

    let isValidPassword = false
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password)
    }catch(err){
      return next(new HttpError('Logging in failed, please try again later.', 500))
    }

    if(!isValidPassword) {
      return next(new HttpError('Bad credentials', 400))
    }

    let token
    try{
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email}, 
        'secret_token', 
        {expiresIn: '1h'}
      )
    } catch(err){
      return next(new HttpError('Login failed, please try again.', 500))
    }
  
    res.json({
      userId: existingUser.id, 
      email: existingUser.email, 
      token: token
    })
  }



exports.getAllUsers = getAllUsers
exports.registerUser = registerUser
exports.loginUser = loginUser
