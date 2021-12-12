const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurants.json').results

// mongodb connection
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')

  // create the data of restaurants.json in mongoDB
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeed done !!!')
      db.close()
    })
    .catch(error => console.error(error))
})



