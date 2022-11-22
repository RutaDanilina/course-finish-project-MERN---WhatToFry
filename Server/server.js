const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {URL} = require('./db')

const fs = require('fs')
const path = require('path')

const HttpError = require('./models/http-error')
const recipesRoutes = require('./routes/recipes-routes')
const usersRoutes = require('./routes/users-routes')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  next()
})


app.use('/api/recipes', recipesRoutes)
app.use('/api/users', usersRoutes)


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404)
    return next(error)
})

app.use((error, req, res, next) => {
  if(req.file){
    fs.unlink(req.file.path, (err)=> {
      console.log(err)
    })
  }
  if (res.headerSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'})
});

mongoose
    .connect(URL)
    .then(()=> {
        app.listen(5000)
    })
    .catch( err => {
        console.log(err)
    })


