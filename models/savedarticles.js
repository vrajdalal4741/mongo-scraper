const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const savedArticlesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

let SavedArticles = mongoose.model('SavedArticles', savedArticlesSchema);

module.exports = SavedArticles;