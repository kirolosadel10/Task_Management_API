const mongoose = require('mongoose');
const Joi = require('joi');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    LastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    Email:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
        validate: [validator.isEmail, 'Invalid Email']
    },
    Password:{
        type: String,
        required: true,
    },
    token:{
        type: String,
    },
});

// validator functions
function validatorForRegisteration(User){
    const schema = Joi.object({
        FirstName: Joi.string().min(3).max(50).required(),
        LastName: Joi.string().min(3).max(50).required(),
        Email: Joi.string().min(5).max(255).required(),
        Password: Joi.required(),
    });
    return schema.validate(User);
}

function validatorForUpdateUserData(User){
    const schema = Joi.object({
        FirstName: Joi.string().min(3).max(50),
        LastName: Joi.string().min(3).max(50),
    });
    return schema.validate(User);
}

const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
    validatorForRegisteration,
    validatorForUpdateUserData,
};