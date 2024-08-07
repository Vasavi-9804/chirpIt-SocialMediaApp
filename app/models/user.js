const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: { type: String, required: true },
  bio: { type: String },
  Gender: { type: String, Enumerator: ["Male", "Female", "Prefer not to say"] },
  followerCount: { type: Number, default: 0 },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  password: { type: String, required: true },
  posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
  
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
