const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        token :{type :String, required : true}
    }
)
const refreshToken = mongoose.model("refreshToken",tokenSchema);
module.exports = {refreshToken };