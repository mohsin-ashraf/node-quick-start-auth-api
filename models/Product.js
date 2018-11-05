const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Product Schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true
  }
});


module.exports = Product = mongoose.model('Product', ProductSchema);


// Model methods

// Get Product By Id
module.exports.getProductById = function (id, callback) {
  Product.findById(id, callback);
}

// Save Product to Database
module.exports.saveProduct = function (product, callback) {
  product.save(callback);
}

// Update Product Product By Id
module.exports.updateProductById = function (id, updatedProduct, callback) {
  query = { _id: id };
  Product.updateOne(query, updatedProduct, callback);
}

// Delete Product By Id
module.exports.deleteProductById = function (id, callback) {
  query = { _id: id };
  Product.remove(query, callback);
}