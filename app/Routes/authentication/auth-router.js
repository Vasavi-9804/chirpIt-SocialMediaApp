const express = require("express");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const { refreshToken } = require("../../models/token");
const { User } = require("../../models/user");

authRouter.post("/signup", async (req, res, next) => {
  try {
    const { username, password, name, bio, Gender } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = new User(req.body);
    await newUser.save();
    const accessToken = generateAccessToken({ username: newUser.username });
    const rToken = jwt.sign(
      { username: newUser.username },
      process.env.REFRESH_TOKEN_SECRET
    );
    await refreshToken.create({ token: rToken, author :newUser.username }); 
    res.user = newUser;
    res.status(201).json({ accessToken, refreshToken: rToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  next();
});
authRouter.post("/login", async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const accessToken = generateAccessToken({ username: user.username });
    const rToken = jwt.sign(
     { username: user.username },
       process.env.REFRESH_TOKEN_SECRET
    );
    refreshToken.create({ token: rToken, author : user.username });
    res.json({ accessToken: accessToken});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  next();
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

authRouter.post(
  "/token",

  async (req, res, next) => {
    const refToken = req.body.token;
    if (refToken == null) return res.sendStatus(401);
    try {
      refreshToken.findOne({ token: refToken });
    } catch (e) {
      console.log("refreshtoken not valid");
      return res.sendStatus(403);
    }
    jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return refToken.sendStatus(403);
      const accessToken = generateAccessToken({ username: user.username });
      res.json({ accessToken: accessToken });
    });
    next();
  }
);

authRouter.delete("/logout", (req, res, next) => {
  refreshToken
    .deleteOne({ token: req.body.token })
    .then(() => {
      res.status(200).send({ message: "Logout successful" });
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(403);
    });
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401).json({message:"token not provided"});
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {return res.sendStatus(403).json({message:"error authenticationg...wrong token"})};
    const user_curr = await User.findOne({ username: user.username });
    req.user = user_curr;
    next();
  });
}
module.exports = { authRouter, authenticateToken };
