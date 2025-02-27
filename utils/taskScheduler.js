const cron = require('node-cron');
const {Task} = require('../models/task_model'); // Assuming Task model is defined
const {User} = require('../models/user_model'); // Assuming User model is defined
const sendEmail = require('./emailService');
const asyncHandler = require("express-async-handler");

// Run the job every day at 12:54 AM
cron.schedule('54 0 * * *', asyncHandler(async () => {
    console.log('Running task scheduler...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log('Today:', today);

    // Find tasks that are due today
    const dueTasks = await Task.find({ Due_Date: today });

    for (const task of dueTasks) {
      const user = await User.findById(task.User_ID);
      if (user && user.Email) {
        await sendEmail(
          user.Email,
          "Task Due Reminder",
          `Reminder: Your task "${task.Title}" is due today. Don't forget to complete it!`
        );
      }
    }
}));

