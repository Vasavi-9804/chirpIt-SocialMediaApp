const express = require("express");
const postRouter = express.Router();
const {authenticateToken} =require ("../Routes/authentication/auth-router")
const {postRepository} = require("../Repository/posts-repository")
const {commentRouter} = require("../Routes/comment")

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


postRouter.post("/create",authenticateToken,upload.single('image'),postRepository.createPost);
postRouter.get("/:id",authenticateToken, postRepository.getAllUserPosts);  //get posts of a user by id
postRouter.patch("/myPosts/:id",authenticateToken,postRepository.editPost);
postRouter.delete("/myPosts/:id",authenticateToken,postRepository.deletePost);
postRouter.patch("/like/:id",authenticateToken,postRepository.likePost);
postRouter.patch("/unlike/:id",authenticateToken,postRepository.unlikePost);
postRouter.use("/comments",commentRouter);
module.exports ={postRouter}