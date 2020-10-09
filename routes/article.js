const express = require('express'),
      router = express.Router(),
      { ensureAuthenticatedArtilce } = require('../config/auth');


// Load Article and User Models
const Article = require('../models/article'),
      User    = require('../models/user');
      



// Add Artilce
router.get('/add', ensureAuthenticatedArtilce, function (req, res) {
    res.render('add-article', {
        title: "Add Article",
        user: req.user
    });
});



// Add Article Submit Route
router.post('/add', function (req, res) {
    const {title, body} = req.body;
    let errors = [];

    if (!title, !body) {
        errors.push({msg: 'Please enter title and body for article'});
    }

    if (title.length < 5) {
        if (!title, !body) {
            errors.push();
        } else {
            errors.push({msg: 'Please enter title more than five'});
        }
    }

    if (errors.length > 0) {
        res.render('add-article', {
            title: 'Add Article',
            errors,
            user: req.user
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success_msg', 'Article aded');
                res.redirect('/articles');
            }
        });
    }
});



// Get Single Article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        User.findById(article.author, function (err, user) {
            res.render('article', {
                article: article,
                author: user.name
            });
        });
    });
});



// Load Edit Form
router.get('/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/articles');
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});



// Update Submit post Route
router.post('/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.auhtor = req.body.author;
    article.body = req.body.body;


    let query = {_id: req.params.id};

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success_msg', 'Artciel Updated');
            res.redirect('/articles');
        }
    });
});



// Delete Article 
router.delete('/:id', function (req, res) {
    if (!req.user.id) {
        res.status(500).send();
    }


    let query = {_id: req.params.id}

    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        };
    });
});





module.exports = router;