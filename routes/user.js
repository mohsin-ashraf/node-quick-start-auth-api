const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const passport = require("passport");
// Get request
// Do with this route whatever you want.
router.get("/", (req, res) => {
	// Do you logic here.
	res.status(200).json({
		success: true,
		result: "Get request to index route of the api"
	});
});


// Get request for getting user by id.
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const id = req.params.id;
	User.getUserById(id, (err, user) => {
		if (err) {
			res.status(500).json({
				success: false,
				result: "Something went wrong on server please try later."
			});
		} else {
			if (!user) {
				res.status(400).json({
					success: false,
					result: "User not found."
				});
			} else {
				res.status(200).json({
					success: true,
					result: user
				});
			}
		}
	});
});

// Post request to create user
router.post('/', (req, res) => {
	// Do your logic here.
	User.getUserByUsername(req.body.username, (err, user) => {
		if (!user) {
			const newUser = new User({
				name: req.body.name,
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				// isAdmin:req.body.isAdmin ** It depends upon you how you want to deal with this part by default isAdmin is set to false
			});
			User.saveUser(newUser, (err, user) => {
				if (err) {
					res.status(500).json({
						success: false,
						result: 'Something went wronge please try later'
					});
				} else {
					res.status(200).json({
						success: true,
						result: user
					});
				}
			});
		} else {
			res.status(500).json({
				success: false,
				result: 'User already exist with this username'
			});
		}
	});
});

// Post request for login.
router.post("/login", (req, res) => {
	const username = req.body.username
	User.getUserByUsername(username, (err, user) => {
		if (err) {
			res.status(500).json({
				success: false,
				result: "Something went wronge on server please try later"
			});
		} else {
			User.comparePassword(req.body.password, user.password, (err, isMatch) => {
				if (err) {
					res.status(500).json({
						success: false,
						result: "Something went wronge on server please try later"
					});
				}
				if (!isMatch) {
					res.status(400).json({
						success: false,
						result: "Invalid password"
					});
				} else {
					if (isMatch) {
						const token = jwt.sign({ data: user }, config.secret, { expiresIn: 604800 });
						res.status(200).json({
							success: true,
							token: "JWT " + token,
							result: user
						});
					}
				}
			});
		}
	});
});

// Post request for the update this route will update by the _id property.
router.put("/update/:id", (req, res) => {
	const id = req.params.id;
	if (req.body.name == '' || req.body.name == null || req.body.name == undefined || req.body.username == '' || req.body.username == null || req.body.username == undefined || req.body.email == '' || req.body.email == null || req.body.email == undefined || req.body.password == '' || req.body.password == null || req.body.password == undefined) {
		// **You can use express validators here but for now I am going to use it as it is maybe at some point I add express validator here. also use the following commented line if you want in the if condition thats totaly upto you.**
		// || req.body.isAdmin == '' || req.body.isAdmin == null || req.body.isAdmin == undefined
		res.status(400).json({
			success: false,
			result: "Please fill the fields"
		});
	} else {
		const updatedUser = new User({
			name: req.body.name,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			isAdmin: req.body.isAdmin
		});
		console.log(updatedUser);
		User.updateUserById(id, updatedUser, (err, result) => {
			if (err) {
				res.status(500).json({
					success: false,
					result: "Something went wrong please try later",
					error: err
				});
			} else {
				res.status(200).json({
					success: true,
					result: result
				});
			}
		});
	}
});

// Make a post route that allow user either to use username or email for his login.

module.exports = router;