const express = require('express');
const router = express.Router(),
      Article = require('../models/article'),
      User = require('../models/user');




// Home page 
router.get('/', function (req, res) {
    res.render('welcome');
});





// Articles Page
router.get('/articles', function (req, res) {
 Article.find({}).populate("author").then(articles => {
    res.render('articles', {
        title: 'Articles',
        articles: articles
    });
 }).catch(err => {
     console.log(err);
     res.json(err)
 });

 
    /* Article.find({}, function (err, articles) {
        if (err) throw err;
                
    }); */
});









module.exports = router;

