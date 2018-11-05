const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const databaseConfig = require("./config/database");
const passport = require("passport");
// Connecting to database...
mongoose.connect(databaseConfig.database, { useNewUrlParser: true }).then(() => {
  console.log("Connected to database successfully.");
}).catch(err => {
  console.log("Unable to connect to database ", err);
});

// Init app
const app = express();

// body-parser middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cors middleware
app.use(cors());

// morgan middleware
app.use(morgan('dev'));

// Route imports 
const userRoute = require("./routes/user");


// Passport middleware
require("./config/passport")(passport);

// Route middlewares **app.use(-----)**
app.use("/users", userRoute);




// Handling Invalid requests.
app.use("*", (req, res) => {
  res.status(400).json({
    success: false,
    message: "Invalied api request"
  });
});

// Export app
module.exports = app;