const express = require("express");
const commentRouter = express.Router();
const {commentRepository} =  require("../Repository/comments-repository")
const {authenticateToken} =require ("../Routes/authentication/auth-router")
const {postRepository} = require("../Repository/posts-repository")

commentRouter.post("/:id",authenticateToken,postRepository.commentPost);
commentRouter.get("/:id",authenticateToken,commentRepository.showComments);
//of a post using id
commentRouter.post("/reply/:id",authenticateToken,commentRepository.replyToComment);
commentRouter.patch("/like/:id",authenticateToken,commentRepository.likeComment);
commentRouter.patch("/unLike/:id",authenticateToken,commentRepository.unLikeComment);
commentRouter.patch("/replies/unLike/:id",authenticateToken,commentRepository.unLikeReply);
commentRouter.patch("/replies/like/:id",authenticateToken,commentRepository.likeReply);
module.exports={commentRouter}