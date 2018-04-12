const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');
const db = require('../models/index.js');
const router = express.Router();
const app = express();

router.get('/scrape', function(req, res) {
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
                    .then(function(dbArticles) {})
                    .catch(function(err) {
                        return res.json(err);
                    });
            });
            res.redirect('/articles');
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

router.get('/saved', function(req, res) {
    db.SavedArticles.find({})
        .populate('comments')
        .then(function(archived) {
            res.render('saved', { articles: archived })
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.post('/api/saved/:id', function(req, res) {
    db.SavedArticles.create({
        'title': req.body.title,
        'link': req.body.link,
        'description': req.body.description
    });
    console.log(req.body);
    db.Articles.remove({
            _id: req.params.id
        },

        function(error, removed) {
            if (error) {
                res.send(error);
            } else {
                console.log('removed');
            }
        }
    );
});

router.post('/api/deleted/:id', function(req, res) {
    db.SavedArticles.remove({
            _id: req.params.id
        },

        function(error, removed) {
            if (error) {
                res.send(error);
            } else {
                console.log('removed')
            }
        }
    )
});

router.post('/api/comment/:id', function(req, res) {
	db.Comment.create({
		'text': req.body.comment
	})
	.then(function(data) {
		return db.SavedArticles.findOneAndUpdate(
			{ _id: req.params.id },
			{ $push: { comments: data._id } }, 
			{ new: true });
	})
	res.redirect('/saved');
});

router.post('/api/remove/:id', function(req, res) {
	db.Comment.remove({
		_id: req.params.id
	},
	function(error, remove) {
		if (error) {
			res.send(error);
		} else {
			res.redirect("/saved");
		}
	})
});

module.exports = router;