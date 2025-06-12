const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(methodOverride("_method")); // Enable method override
app.use(express.urlencoded({ extended: true })); // Parse form data
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "Styling"))); // Fix static files setup

let posts = [
  { id: uuidv4(), task: "This is a delete function" },
  { id: uuidv4(), task: "This is an update function" },
  { id: uuidv4(), task: "This is a get function" },
];

// Route to display posts
app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

// Create a new post
app.post("/posts", (req, res) => {
  let { task } = req.body;
  let id = uuidv4();
  posts.push({ id, task });
  res.redirect("/posts");
});

// Route to show edit form
app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  res.render("edit.ejs", { post });
});

// ✅ Fixed PATCH Route to Update Post
app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.task;
  let post = posts.find((p) => p.id === id);

  if (post) {
    post.task = newContent;
    console.log("Updated Post:", post);
  }

  res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/posts");
});

// Start Server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
