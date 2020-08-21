var express = require('express');
var router = express.Router();
var database = require('../connect/firebase_admin');
var stringtag = require("striptags");
var moment = require("moment");
var database = require("../connect/firebase_admin");
var categoriesRef = database.ref("categories");
var articlesRef = database.ref("/articles");


/* GET home page. */

router.get("/", function (req, res) {
  let categories = {};
  categoriesRef.once('value')
    .then(function (snapshot) {
      categories = snapshot.val();
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      const articles = [];
      snapshot.forEach(function (snapshotChild) {
        articles.push(snapshotChild.val())
      })
      articles.reverse();
      res.render('index', {
        categories: categories,
        articles: articles,
        stringtag: stringtag,
        moment: moment,
      })
    })
});

module.exports = router;