// TODO Connect knex to create posts route.

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "deontemanning",
    database: "node_blog",
  },
});

const helpers = require("./helpers");
const handlePosts = require("./controllers/handlePosts");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const { content_body } = await helpers.getSiteContent(req, res, knex, 1);
  const homeStartingContent = content_body;
  const posts = await handlePosts.getPosts(req, res, knex);
  res.render("home", { homeStartingContent, posts });
});

app.get("/about", async (req, res) => {
  const { content_body } = await helpers.getSiteContent(req, res, knex, 2);
  const aboutContent = content_body;
  res.render("about", { aboutContent });
});

app.get("/contact", async (req, res) => {
  const { content_body } = await helpers.getSiteContent(req, res, knex, 3);
  const contactContent = content_body;
  res.render("contact", { contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const post = {
    post_title: req.body.postTitle,
    post_content: req.body.postBody,
  };

  await handlePosts.composePost(req, res, post, knex);

  res.redirect("/");
});

app.get("/posts/:postName", async (req, res) => {
  const posts = await handlePosts.getPosts(req, res, knex);
  try {
    const post = await handlePosts.fetchPost(
      req,
      res,
      knex,
      req.params.postName
    );
    if (!post || post === undefined) {
      res.render("404", { posts });
    } else {
      res.render("post", { postData: post });
    }
  } catch (error) {
    res.render("404", { posts });
  }
});

app.get("/404", async (req, res) => {
  const posts = await handlePosts.getPosts(req, res, knex);
  res.render("404", { posts });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
