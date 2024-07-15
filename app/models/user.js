const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {  
        name: {type: String, required : true},
        bio: {type: String},
        Gender:{ type:String, Enumerator:['Male','Female','Prefer not to say']},
        followerCount : {type : Number, default : 0},
        followers: [{ type: Schema.Types.ObjectId, ref: 'User',default:[] }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User' ,default : []}],
        password : {type: String , required:true },
        posts:[{type: Schema.Types.ObjectId ,ref : 'post'}],
        verified : {type :Boolean,default:false}
    }
)

const User = mongoose.model("User",userSchema);
module.exports = { User };
   
