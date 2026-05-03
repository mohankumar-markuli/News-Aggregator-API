const mongoose = require("mongoose");

const connectDb = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);
};

module.exports = connectDb;