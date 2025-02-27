// OutSourced Modules
const express = require('express');
const Joi = require('joi');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');

// custom modules
const Tasksrouter = require('./routes/tasks_routes');
const Usersrouter = require('./routes/user_routes');
const {errorHandler, ResourceNotFound} = require('./middlewares/error_handler');
require('./utils/taskScheduler'); // Import to start the scheduler

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// mongoose connection
const db = process.env.MONGO_URI;
mongoose.connect(db)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Routes
app.use('/api', Usersrouter);
app.use('/api/tasks', Tasksrouter);

// resource not found middleware
app.all('*', ResourceNotFound);
app.use(errorHandler);

// runnig the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});