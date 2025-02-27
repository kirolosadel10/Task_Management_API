// custom modules
const { Task , validatorForCreatingTask, validatorForUpdatingTask} = require('../models/task_model');
const httpStatusTexts = require('../utils/http_status_text');

const GetAllTasks = async (req, res) => {
    const tasks = await Task.find({}, {"__v": false});
    res.status(200).json({status: httpStatusTexts.SUCCESS,data: {tasks}, ErrorMessage: null});
};

const GetTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id, {"__v": false});
    if(task) {
        res.status(200).json({status: httpStatusTexts.SUCCESS,data: {task}, ErrorMessage: null});
    } else {
        res.status(404).json({status: httpStatusTexts.FAIL,data: {task: null}, ErrorMessage: null});
    }
};

const CreateNewTask = async (req, res) => {
    const { error } = validatorForCreatingTask(req.body);
    if (error) return res.status(400).json({status: httpStatusTexts.ERROR, data: null,ErrorMessage: error.details[0].message});

    const task = new Task({
        Title: req.body.Title,
        Description: req.body.Description,
        Status: req.body.Status,
        Due_Date: req.body.Due_Date,
        User_ID: req.body.User_ID
    });
    const newTask = await task.save();
    const taskWithoutVersion = newTask.toObject();
    delete taskWithoutVersion.__v;
    res.status(201).json({status: httpStatusTexts.SUCCESS, data: {task: taskWithoutVersion}, ErrorMessage: null});
};

const UpdateTaskById = async (req, res) => {
    const { error } = validatorForUpdatingTask(req.body);
    if (error) return res.status(400).json({status: httpStatusTexts.ERROR,data: null,ErrorMessage: error.details[0].message});

    const task = await Task.findById(req.params.id);
    if(task){
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            $set:{
            Title: req.body.Title,
            Description: req.body.Description,
            Status: req.body.Status,
            Due_Date: req.body.Due_Date,
            }
        }, { new: true });

        const taskWithoutVersion = updatedTask.toObject();
        delete taskWithoutVersion.__v;
        res.status(200).json({status: httpStatusTexts.SUCCESS, data: {task: taskWithoutVersion}, ErrorMessage: null});
    } else {
        res.status(404).json({status: httpStatusTexts.FAIL,data: {task: null}, ErrorMessage: null});
    }
};

const DeleteTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if(task){
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({status: httpStatusTexts.SUCCESS,data: null, ErrorMessage: null});
    }else{
        res.status(404).json({status: httpStatusTexts.FAIL,data: {task: null}, ErrorMessage: "task not found"});
    }
};

module.exports = {
    GetAllTasks,
    GetTaskById,
    CreateNewTask,
    UpdateTaskById,
    DeleteTaskById
};