const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// User Schema.
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = User = mongoose.model('User', UserSchema);

// Model Methods

// Get User By Id
module.exports.getUserById = function (id, callback) {
  id = mongoose.Types.ObjectId(id);
  User.findById(id, callback);
}

// Get User By Username
module.exports.getUserByUsername = function (username, callback) {
  query = { username, username }
  User.findOne(query, callback);
}

// Save User To Database
module.exports.saveUser = function (user, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      throw err;
    } else {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          user.password = hash;
          user.save(callback);
        }
      });
    }
  });
}

// Compare Password 
module.exports.comparePassword = function (condidatePassword, hash, callback) {
  bcrypt.compare(condidatePassword, hash, (err, isMatch) => {
    if (err) {
      throw err;
    } else {
      callback(err, isMatch);
    }
  });
}

// Update User By Id
module.exports.updateUserById = function (id, updatedUser, callback) {
  query = { _id: mongoose.Types.ObjectId(id) };
  console.log(query);
  User.updateOne(query, updatedUser, callback);
}

// Update User By Username
module.exports.updateUserByUsername = function (username, updatedUser, callback) {
  query = { username: username };
  User.updateOne(query, updatedUser, callback);
}

// Delete User By Id
module.exports.deleteUserById = function (id, callback) {
  query = { _id: id };
  User.remove(query, callback);
}

// Delete User By Username
module.exports.deleteUserByUsername = function (username, callback) {
  query = { username: username };
  User.remove(query, callback);
}