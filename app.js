const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
const methodOverride = require("method-override") // function for ?_method=PUT and ?_method=DELETE

const app = express()
const port = 3000

// mongodb connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// setting handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }))
app.set('view engine', 'hbs')

// use css & js
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) // Express include the body-parser from version 4.16.0 


// render index.hbs to {{{ body }}} of main.hbs
app.get('/', (req, res) => {
  Restaurant.find() // this is an array
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// render search restaurants
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  let searchRestaurants = []
  Restaurant.find()
    .lean()
    .then(restaurants => {
      searchRestaurants = restaurants.filter(restaurant => {
        return restaurant.name.trim().toLowerCase().includes(keyword) || restaurant.name_en.trim().toLowerCase().includes(keyword)
      })
      res.render('index', { restaurants: searchRestaurants, keyword })
    })
})

// render new page for adding restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// add new restaurant
app.post("/restaurants", (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// render detail page of restaurant
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// render edit page of restaurant
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const restaurantId = req.params.restaurant_id
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurant => res.render("edit", { restaurant }))
    .catch(error => console.log(error))
})

// update restaurant information
app.put('/restaurants/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(error => console.log(error))
})

// delete restaurant
app.delete("/restaurants/:restaurant_id", (req, res) => {
  const restaurantId = req.params.restaurant_id
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch(error => console.log(error))
})

// router listener
app.listen(port, () => {
  console.log(`express is listening on localhost: ${port}`)
})