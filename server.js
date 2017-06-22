var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})




var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));



app.post('/posts', function (req, res) {
  var newPost = Post.create(req.body, function (err, post) {
    if (err) {
      res.send('error saving new Post')
    } else {
      console.log(post)
      res.send(post)
    }
  });
})




app.delete('/posts/:deletePostId', function (req, res) {
  var deletePostId = req.params.deletePostId;

  Post.findByIdAndRemove(deletePostId, function (err, status) {
    if (err) {
      throw err;
    } else {
      res.send(status);
    }
  })
});

app.delete('/posts/:postId/comments/:commentId', function (req, res) {
  var update = {
    $pull: {
      comments: {
        _id: req.params.commentId
      }
    }
  }
  Post.findByIdAndUpdate(req.params.postId, update, function (err, status) {
    if (err) {
      throw err;
    } else {
      res.send(status);
    }
  })
});

app.get('/posts', function (req, res) {
  Post.find(function (error, posts) {
    res.send(posts);
  });
});


app.post('/posts/:postId/comments', function (req, res) {

  var update = {
    $push: {
      comments: req.body
    }
  }

  Post.findByIdAndUpdate(req.params.postId, update, {new:true},
    function (err, post) {
      if (err) {
        return res.status("500").send(err);
      }
      res.send(post);
    })

  // Post.findById(req.params.postId, function (err, post) {
  //   if (err) {
  //     return res.status("500").send(err);
  //   }

  //   post.comments.push(req.body)
  //   post.save(function (err, data) {
  //     if (err) {
  //       return res.status("500").send(err);
  //     }
  //     res.send(data);
  //   })
  // })

  // Post.update({
  //     _id: req.params.postId
  //   }, {
  //     $push: {
  //       comments: req.body
  //     }
  //   },
  //   function (err, data) {
  //     if (err) {
  //       res.status("500").send(err)
  //     } else {
  //       res.send(data);
  //     }
  //   })
});



// var book3 = new Post({
//   text: "Welcome to my Third Post",
//   comments: []
// })

// book3.comments.push({text: "Dvir", comment: "great Third Post"})

// book3.save();

// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

//   var newComment = Post.find().update(req.body, function (err, post) {
// Post
//     if (err) {
//       res.send('error saving new Comment')
//     } else {
//       console.log(post)
//       res.send(post)
//     }
//   });
// })

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});