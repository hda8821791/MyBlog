var express = require("express");
var router = express.Router();
var stringtag = require("striptags");
var moment = require("moment");
var convertPagination = require('../modules/convetPaginaion')

var database = require("../connect/firebase_admin");
var categoriesRef = database.ref("categories");
var articlesRef = database.ref("/articles");

/* GET home page. */

router.get("/", function (req, res) {
  const currentPage = Number.parseInt(req.query.page) || 1;
  let categories = {};
  categoriesRef
    .once("value")
    .then(function (snapshot) {
      categories = snapshot.val();
      return articlesRef.orderByChild("update_time").once("value");
    })
    .then(function (snapshot) {
      const articles = [];
      snapshot.forEach(function (snapshotChild) {
        if ("public" === snapshotChild.val().status) {
          articles.push(snapshotChild.val());
        }
      });
      articles.reverse();

      const data = convertPagination(articles, currentPage);

      res.render("index", {
        categories: categories,
        stringtag: stringtag,
        moment: moment,
        articles: data.data,
        page: data.page
      });
    });
});
//分頁結束
router.get("/post/:id", function (req, res) {
  const id = req.param("id");
  console.log("id", id);
  let categories = {};
  categoriesRef
    .once("value")
    .then(function (snapshot) {
      categories = snapshot.val();
      return articlesRef.child(id).once("value");
    })
    .then(function (snapshot) {
      const article = snapshot.val();
      res.render("post", {
        categories: categories,
        article: article,
        stringtag: stringtag,
        moment: moment,
      });
    });
});
module.exports = router;