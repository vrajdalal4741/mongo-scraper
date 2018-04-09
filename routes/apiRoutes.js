const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const db = require('../models/index.js');
const router = express.Router();
const app = express();

router.get('/scrape', function (req, res) {
	axios.get("http://www.nfl.com/fantasyfootball?icampaign=fty-nav-hp")
	.then(function(response) {
		let $ = cheerio.load(response.data);
		let result = {};
		$(".text").each(function(i, element) {

			result.title = $(this)
				.children('h3')
				.text();
			result.link = $(this)
				.children('h3')
				.children('a')
				.attr('href');
			result.description = $(this)
				.children('p')
				.text();

			db.Articles.create(result)
				.then(function(dbArticles) {
				})
				.catch(function(err) {
					return res.json(err);
				});
		});
		// res.redirect('back');
	});
});

router.get('/articles', function(req, res) {
	db.Articles.find({})
		.then(function(results) {
			res.render('index', { articles: results });
		})
		.catch(function(err) {
			res.json(err);
		});
});

module.exports = router;