var express = require("express");
var router = express.Router();
var stringtag = require("striptags");
var moment = require("moment");
var database = require("../connect/firebase_admin");
var categoriesRef = database.ref("categories");
var articlesRef = database.ref("/articles");

/* 後台 */
router.get("/archives", function (req, res) {
  const status = req.query.status || "public";
  let categories = {};
  categoriesRef.once('value')
    .then(function (snapshot) {
      categories = snapshot.val();
      return articlesRef.orderByChild('update_time').once('value')
    })
    .then(function (snapshot) {
      const articles = [];
      snapshot.forEach(function (snapshotChild) {
        if (status === snapshotChild.val().status) {
          articles.push(snapshotChild.val())
        }
      })
      articles.reverse();
      res.render('dashboard/archives', {
        categories: categories,
        articles: articles,
        status: status,
        stringtag: stringtag,
        moment: moment,
      })
    })
});

router.post('/archives/delete/:id', function (req, res) {
  const id = req.param('id');
  articlesRef.child(id).remove();
  res.send('文章已刪除').end();
})
/* 文章 */
router.get("/article/create", function (req, res) {
  categoriesRef.once("value", function (snapshot) {
    const categories = snapshot.val();
    res.render("dashboard/article", {
      categories: categories,
    });
  });
});

router.get("/article/:id", function (req, res) {
  const id = req.param("id");
  let categories = {}
  categoriesRef.once('value')
    .then(function (snapshot) {
      categories = snapshot.val();
      return articlesRef.child(id).once('value')
    })
    .then(function (snapshot) {
      const article = snapshot.val();
      res.render('dashboard/article', {
        categories: categories,
        article: article
      })
    })
});

router.post("/article/create", function (req, res) {
  const articles = articlesRef.push();
  const key = articles.key;
  const update_time = Math.floor(Date.now() / 1000);
  const data = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    id: key,
    status: req.body.status,
    update_time: update_time,
  };
  articles.set(data).then(function () {
    res.redirect(`/dashboard/article/${key}`);
  });
});

router.post("/article/update/:id", function (req, res) {
  const id = req.param("id");
  const update_time = Math.floor(Date.now() / 1000);
  const data = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    id: id,
    status: req.body.status,
    update_time: update_time,
  };
  articlesRef
    .child(id)
    .update(data)
    .then(function () {
      res.redirect(`/dashboard/article/${id}`);
    });
});
/* 分類 */
router.get("/categories", function (req, res) {
  const message = req.flash("info");
  categoriesRef.once("value", function (snapshot) {
    res.render("dashboard/categories", {
      category: snapshot.val(),
      message: message,
      hasInfo: message.length > 0,
    });
  });
});

router.post("/categories/create", function (req, res) {
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  const data = {
    name: req.body.name,
    path: req.body.path,
    key: key,
  };
  categoriesRef
    .orderByChild("path")
    .equalTo(data.path)
    .once("value", function (snapshot) {
      if (snapshot.val()) {
        req.flash("info", "已有相同路徑");
        res.redirect("/dashboard/categories");
      } else {
        categoryRef.set(data);
        res.redirect("/dashboard/categories");
      }
    });
});

router.post("/categories/delete/:id", function (req, res) {
  const id = req.param("id");
  categoriesRef.child(id).remove();
  res.send("分類已刪除").end();
});
module.exports = router;