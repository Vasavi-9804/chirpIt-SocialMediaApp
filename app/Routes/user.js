const express = require("express");
const userRouter = express.Router();
const { authenticateToken } = require("../Routes/authentication/auth-router");
const {userRepository}= require("../Repository/user-repository");

userRouter.patch("/editProfile", authenticateToken, userRepository.editProfile);
userRouter.patch("/follow/:id", authenticateToken, userRepository.followUser);
userRouter.patch("/unfollow/:id", authenticateToken,userRepository.unfollowUser);
userRouter.get("/viewProfile/:id", authenticateToken,userRepository.viewUserProfile);
module.exports = { userRouter };
