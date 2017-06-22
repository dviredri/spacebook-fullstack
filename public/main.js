var SpacebookApp = function () {

  var posts = [];

  function fetch() {
    $.ajax({
      method: "GET",
      url: '/posts',
      dataType: "json",
      success: function (data) {
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };
  fetch();

  function deletePost(postIndex) {
    $.ajax({
      method: "DELETE",
      url: '/posts/' + postIndex,
      success: function (data) {

        console.log("post deleted");
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };

    function deleteCommentDB(postIndex, commentIndex) {
    $.ajax({
      method: "DELETE",
      url: '/posts/' + postIndex+'/comments/'+commentIndex,
      success: function (data) {

        console.log("comments deleted");
        fetch();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  };

  function saveNewPost(data) {
    $.ajax('/posts', {
      method: "POST",
      data: data,
      success: function (data) {
        console.log(data);
        posts.push(data);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  }

  function saveNewComment(newComment, postId, postIndex) {
    $.ajax('/posts/'+postId+"/comments", {
      method: "POST",
      data: newComment,
      success: function (data) {


        posts[postIndex] = data;

        _renderComments(postIndex);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    })
  }

  var $posts = $(".posts");



  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    posts.push({
      text: newPost,
      comments: []
    });
    _renderPosts();
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (index) {
    posts.splice(index, 1);
    _renderPosts();
  };

  var addComment = function (newComment, postIndex) {
    posts[postIndex].comments.push(newComment);
    _renderComments(postIndex);
  };


  var deleteComment = function (postIndex, commentIndex) {
    posts[postIndex].comments.splice(commentIndex, 1);
    _renderComments(postIndex);
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    _renderPosts: _renderPosts,
    saveNewPost: saveNewPost,
    deletePost: deletePost,
    saveNewComment: saveNewComment,
    deleteCommentDB: deleteCommentDB

  };

};

var app = SpacebookApp();


$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {

    newPostObj = {
      text: $input.val()
    }
    app.saveNewPost(newPostObj);
    $input.val("");

  }

});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var postIndex = $(this).closest('.post').attr("id");;
  app.deletePost(postIndex);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postId = $(this).closest('.post').attr("id");
  var postIndex = $(this).closest('.post').index();
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.saveNewComment(newComment, postId, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').attr("id");
  var commentIndex = $(this).closest('.comment').attr("id");

  app.deleteCommentDB(postIndex, commentIndex);
});