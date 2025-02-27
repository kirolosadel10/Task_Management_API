const mongoose = require('mongoose');
const Joi = require('joi');

const TaskSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    Description:{
        type: String,
        minlength: 3,
        maxlength: 255
    },
    Status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        required: true,
        minlength: 3,
        maxlength: 50,
        default: 'pending'
    },
    Due_Date:{
        type: Date,
        required: true,
    },
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{
    timestamps: true
});

// validator functions
function validatorForCreatingTask(task){
    const schema = Joi.object({
        Title: Joi.string().min(3).max(50).required(),
        Description: Joi.string().min(3).max(255),
        Status: Joi.string().valid('pending', 'in-progress', 'completed').min(3).max(50),
        Due_Date: Joi.date().required(),
        User_ID: Joi.string().hex().length(24).required()
    });
    return schema.validate(task);
}

function validatorForUpdatingTask(task){
    const schema = Joi.object({
        Title: Joi.string().min(3).max(50),
        Description: Joi.string().min(3).max(255),
        Status: Joi.string().valid('pending', 'in-progress', 'completed').min(3).max(50),
        Due_Date: Joi.date()
    });
    return schema.validate(task);
}

const Task = mongoose.model("Task", TaskSchema);

module.exports = {
    Task, 
    validatorForCreatingTask,
    validatorForUpdatingTask
};