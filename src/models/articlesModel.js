const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },

    articleId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    content: {
        type: String
    },
    url: {
        type: String
    },
    image: {
        type: String
    },
    publishedAt: {
        type: Date
    },
    sourceName: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },

    isFavorite: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

articleSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model("Article", articleSchema);