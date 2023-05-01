const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
mongoose.connect("mongodb://127.0.0.1:27017/articleDB");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const articleSchema = new mongoose.Schema({ title: String, content: String });
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(async function (req, res) {
    try {
      const all = await Article.find();
      if (all) {
        res.send(all);
      } else {
        console.log("error not found");
      }
    } catch (err) {
      res.send(err);
    }
  })
  .post(async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });
      await newArticle.save();
      res.send("successful submission");
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const dlt = await Article.deleteMany();
      res.send("delete successfull");
    } catch (error) {
      res.send(error);
    }
  });

app
  .route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const foundArticle = await Article.find({
        title: req.params.articleTitle,
      });
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("Article with the name does not exist");
      }
    } catch (error) {
      res.send(error);
    }
  })
  .put(async (req, res) => {
    try {
      const articleTitle = req.params.articleTitle;
      const putRequest = await Article.updateMany(
        { title: articleTitle },
        { title: req.body.title, content: req.body.content }
      );
      if (putRequest) {
        console.log(putRequest);
        res.send("Update successful");
      } else {
        res.send("Unable to update article");
      }
    } catch (error) {
      res.send(error);
    }
  })
  .patch(async (req, res) => {
    try {
      const articleTitle = req.params.articleTitle;
      const putRequest = await Article.updateMany(
        { title: articleTitle },
        { $set: req.body } //body parser will set only the field that the user wants to set
      );
      if (putRequest) {
        console.log(putRequest);
        res.send("Update successful");
      } else {
        res.send("Unable to update article");
      }
    } catch (error) {
      res.send(error);
    }
  }).delete(async (req,res)=>
  {
    try {
      const articleTitle = req.params.articleTitle;
      const deletedArticle = await Article.deleteOne({title:articleTitle});
      if(deletedArticle)
      {
        res.send("successfull deletion")
      }else{
        res.send("Could not delete !!!")
      }
    } catch (error) {
      console.error(error);
    }
  })

app.listen(3000, () => {
  console.log("listening at port 3000");
});
