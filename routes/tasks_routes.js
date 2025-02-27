// OutSourced Modules
const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const TasksController = require('../controllers/tasks_controllers');

// custom middelware
const {VerifyToken} = require('../middlewares/verify_token');

router.route('/')
    .get(asyncHandler(VerifyToken),asyncHandler(TasksController.GetAllTasks))
    .post(asyncHandler(VerifyToken),asyncHandler(TasksController.CreateNewTask));

router.route('/:id')
    .get(asyncHandler(VerifyToken),asyncHandler(TasksController.GetTaskById))
    .put(asyncHandler(VerifyToken),asyncHandler(TasksController.UpdateTaskById))
    .delete(asyncHandler(VerifyToken),asyncHandler(TasksController.DeleteTaskById));

module.exports = router;
