const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  category : {
    type : String,
    required: true
  },
  rating : {
     type : Number,
  },
  stock : {
    type : String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);