var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})



var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var book3 = new Post({
  text: "Welcome to my Third Post",
  comments: []
})

// book3.comments.push({text: "Dvir", comment: "great Third Post"})

// book3.save();

// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post
app.get('/posts', function (req, res) {
  Post.find(function (error, posts) {
    res.send(posts);
  });
});

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});
