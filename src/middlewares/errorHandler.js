const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode || err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
};

module.exports = { errorHandler };