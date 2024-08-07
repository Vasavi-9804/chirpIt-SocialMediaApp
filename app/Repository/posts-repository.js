
const {Post} = require("../models/post")
const {User} = require("../models/user")
const {Comment} = require("../models/comment")
const createPost = async (req, res, next) => {
  try {
      // Extract the post data from the request body
      const { content } = req.body;
      const author = req.user._id;
      const image = req.file ? req.file.buffer : null;
      const imageType = req.file ? req.file.mimetype : null;
      const post = new Post({
          content,
          image,
          imageType,
          author
      });
      await post.save();
      const user = await User.findById(author);
      if (user) {
          user.posts.push(post._id);
          await user.save();
      }
      res.status(201).json({
          data: post,
          success: true,
          message: "Post created successfully",
          error: ""
      });
  } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
          data: null,
          success: false,
          message: "Error creating post",
          error: { error }
      });
  }
};

const getAllUserPosts = async (req,res) => {
  try {
    const id_user_posts = req.params.id;
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const userOfPosts = await User.findById(id_user_posts);
    if(!userOfPosts){
      return res.status(404).json({ error: 'User not found' });
    }
    const followee = await user.following.includes(id_user_posts);
    
    if(followee || user._id.equals(id_user_posts)){
          const posts = await Post.find({author : id_user_posts})
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
        const totalPosts = await Post.countDocuments({author:id_user_posts});
        return res.json({
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page
          });
    }else{
      
      return res.status(403).json({ error: 'Access denied. You are not a follower.' });
    }
   
      
  } catch (error) {
    return res.status(500).json({
      data: null,
      success: false,
      message: "Internal server error",
      error: { error },
    });
  }
};

const  editPost = async(req,res,next)=>{
  try{
     const post_id = req.params.id;
     const user_id = req.user._id;
     const post =await  Post.findById(post_id);
     if(!post){
      return res.status(404).json({error:"post not found"});
     }
    
     if(post.author.equals(user_id)){
        if(req.body.content) { post.content = req.body.content;}
        if(req.body.image){
          post.image = req.body.image;
        }
      await post.save();
      return res.json({
        post
      });
     }else{
      return res.status(404).json({error:"post access denied"});
     }
  }catch(error){
      console.error("Error edititng the post:", error);
      return res.status(500).json({ error: "Server error" });
  }
  next();
}
const deletePost = async (req,res,next)=>{

   try{
    const  post_id =req.params.id;
    const  user = req.user;

    const post = await Post.findById(post_id);
    if(!post){
      return res.status(404).json({error:"post not found"});
    }
    if(post.author.to_string()!=user._id){
      return res.status(403).json({
        error : "access denied"
      })
    }
    user.posts = user.posts.filter(
      (id) => id.toString()!==post_id
    );
    await user.save();
    await Post.findByIdAndDelete(post_id);
    res.json({ success: true, message: 'Post deleted successfully' });
   } catch{
    console.error("Error deleting the post:", error);
    return res.status(500).json({ error: "Server error" });
   }
  }

const commentPost = async (req,res,next)=>{
  try{
    const user = req.user;
    const post_id = req.params.id;
    const post = await Post.findById(post_id);
    const data = req.body;
    if(!post){
      return res.status(404).json({
        error : "post not exist", 
      })
    }
    const author_id = post.author;
    //check if user is follower of the author of post
    if(user.following.includes(author_id)){
        const comment = await Comment.create(data);
        post.comments.push(comment);
        await post.save();
        return res.status(200).json({
          message: "Comment added successfully",
          comment,
        });    
    }else{
      return res.status(403).json({
        error : "Cannot comment since you are not a follower of the author", 
      })
    }
  }catch(error){
    console.error("Error commenting  the post:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

const likePost = async (req,res,next) => {
    const user = req.user;
    const post_id = req.params.id;
    const post = await Post.findById(post_id);
    if(!post){
      return res.status(404).json({
        error : "post not found", 
      })
    }
    if(user.following.includes(post.author)){
      if(post.likes.includes(user._id)){
        return res.status(403).json({
          error : "Already liked", 
        })
      }
          post.totalLikes+=1;
          post.likes.push(user._id);
          await post.save();
          return res.status(200).json({
            message: "liked successfully",
          
          }); 
    }else{
      return res.status(403).json({
        error : "Cannot like since you are not a follower of the author", 
      })
    }

}
const unlikePost = async (req, res, next) => {
  try {
    const user = req.user;
    const post_id = req.params.id; 
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }
    if (!post.likes.includes(user._id)) {
      return res.status(400).json({
        error: "You have not liked this post",
      });
    }
    post.totalLikes -= 1;
    post.likes = post.likes.filter(userId => userId.toString() !== user._id.toString());
    await post.save();
    
    return res.status(200).json({
      message: "Unliked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while unliking the post",
    });
  }
};

module.exports ={
  postRepository :{
    createPost,
    getAllUserPosts,
    editPost,
    deletePost,
    commentPost,
    unlikePost,
    likePost
  }
};


// get all posts of a user (by id)( if the user who is asking is a follower)
 // ->find the user by id and check if asking user follows or not...if yes query all posts of the user with pagenation;

 // api/users/post/

