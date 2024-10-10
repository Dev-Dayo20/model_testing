const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const userInfo = require("./models/product.models.js");
const blog = require("./models/blog.models.js");

PORT = process.env.port;
const app = express();

app.use(express.json());
// app.use((req, res, next) => {
//   console.log("new request made");
//   console.log("host", req.hostname);
//   console.log("path", req.path);
//   console.log("method", req.method);
//   next();
// });

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("connected to database");

    app.post("/api/blog/post", async (req, res) => {
      try {
        const newBlog = await blog.create(req.body);
        console.log("Blog created succesfully", newBlog);
        res
          .status(200)
          .json({ message: "Blog post created successfully", blog: newBlog });
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    app.get("/api/blog/post", async (req, res) => {
      try {
        const blogPost = await blog.find();
        res
          .status(200)
          .json({ message: "Blog retrieve successfully", blog: blogPost });
      } catch (error) {
        res
          .status(404)
          .json({ message: "Fail to retrieve blog post.", blog: blogPost });
      }
    });

    app.put("/api/blog/post/updated/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { title, content, author, publishedBy } = req.body;
        const updatedBlog = await blog.findByIdAndUpdate(
          { _id: id },
          {
            title: title,
            content: content,
            author: author,
            publishedBy: publishedBy,
          }
        );
        console.log("Update successfully!");
        res.status(200).json({
          message: "Updated blog successfully",
          updateblog: updatedBlog,
        });
      } catch (error) {
        console.log("OOOPSS!!! Not Successful, something went wrong");
        res.status(404).json(error);
      }
    });

    app.delete("/api/blog/post/deletedpost/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const deleteBlogPost = await blog.findByIdAndDelete({ _id: id });
        console.log("Successfully deleted blog post");
        res.status(200).json({
          Message: "Blog Post Deleted Successfully!",
          deletedPost: deleteBlogPost,
        });
      } catch (error) {
        res.status(500);
        console.log((error) => {
          `Error: ${error}`;
        });
      }
    });
  })
  .catch((error) => console.log(`Error: ${error}`));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
