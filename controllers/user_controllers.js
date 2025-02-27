// outsourced modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generate_jwt');

// custom modules
const { User, validatorForRegisteration, validatorForUpdateUserData } = require('../models/user_model');
const httpStatusTexts = require('../utils/http_status_text');

const UserRegistration = async (req, res) => {
    const { error } = validatorForRegisteration(req.body);
    if (error) return res.status(400).json({status: httpStatusTexts.ERROR, data: null ,ErrorMessage: error.details[0].message});

    const {Email} = req.body;
    const oldUser = await User.findOne({Email});
    if(oldUser) return res.status(400).json({status: httpStatusTexts.ERROR, data: null ,ErrorMessage: "User already exists"});

    // password Hashing logic
    const password = req.body.Password.toString();
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedpassword); // Debugging statement

    const user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: hashedpassword
    });

    // generate JWT token
    const token = await generateJWT({Email: user.Email, id: user._id});
    user.token = token;

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.__v;
    res.status(201).json({status: httpStatusTexts.SUCCESS, data: userResponse, ErrorMessage: null});
};

const UserLogin = async (req, res) => {
    const {Email, Password} = req.body;
    const user = await User.findOne({Email});
    if(!user) return res.status(400).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: "User not found"});
    

    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if(!isPasswordValid) return res.status(400).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: "Invalid Password"});

    // generate JWT token
    const token = await generateJWT({Email: user.Email, id: user._id});

    res.status(200).json({status: httpStatusTexts.SUCCESS, data: { token }, ErrorMessage: null});
};

const GetAllUsers = async (req, res) => {
    const users = await User.find({}, {"__v": false, "Password": false, "token": false});
    res.status(200).json({status: httpStatusTexts.SUCCESS, data: users, ErrorMessage: null});
};

module.exports = {
    UserRegistration,
    UserLogin,
    GetAllUsers
};