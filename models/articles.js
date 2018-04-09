const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articlesSchema = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	link: {
		type: String,
		required: true,
		unique: true
	},
	summary: {
		type: String,
		required: true,
		unique: true
	}
});

let Articles = mongoose.model('Articles', articlesSchema);

module.exports = Articles;