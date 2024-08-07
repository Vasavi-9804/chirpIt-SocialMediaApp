const express = require("express");
const appRouter = express.Router();
const {postRouter} = require("../Routes/posts")
const {userRouter} = require("../Routes/user")
module.exports = {appRouter};

appRouter.use('/users',userRouter);
appRouter.use('/users/posts',postRouter);