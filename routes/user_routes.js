// OutSourced Modules
const express = require('express');
const asyncHandler = require("express-async-handler");
const UserControllers = require('../controllers/user_controllers');

// custom middelware
const {VerifyToken} = require('../middlewares/verify_token');

const router = express.Router();

// Registration
router.post('/register', asyncHandler(UserControllers.UserRegistration));
router.post('/login', asyncHandler(UserControllers.UserLogin));

// Protected routes
router.get('/users', asyncHandler(VerifyToken), asyncHandler(UserControllers.GetAllUsers));


module.exports = router;