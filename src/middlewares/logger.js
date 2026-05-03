const logger = (req, res, next) => {
    console.log(`-- Request received: http://localhost:${process.env.PORT}${req.url}`);
    next();
}

module.exports = { logger };