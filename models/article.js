const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Article Shcema
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    body: {
        type: String,
        required: true
    }
});


const Article = module.exports = mongoose.model('Article', articleSchema);