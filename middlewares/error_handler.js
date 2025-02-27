const httpStatusTexts = require('../utils/http_status_text');

const errorHandler = (err, req, res, next) => {
    const finalStatusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(finalStatusCode).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: err.message});
};

const ResourceNotFound = (req, res) => {
    res.status(404).json({status: httpStatusTexts.ERROR, data: null, ErrorMessage: `Resource not found - ${req.originalUrl}`});
};

module.exports = {errorHandler, ResourceNotFound};