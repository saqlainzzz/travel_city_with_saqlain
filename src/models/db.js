const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
    .then( () => console.log(`MongoDB Connected: ${process.env.MONGO_URI}`) )
  .catch(err => {
    console.error('MongoDB Connection Failed')
    console.error(err)
  })

module.exports = mongoose
