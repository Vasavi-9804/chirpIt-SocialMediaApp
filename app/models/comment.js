const mongoose =require("mongoose");
const commentSchema = new mongoose.Schema(
    {   
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true , maxlength: 50},
        numLikes : {type:Number,default:0},
        likes :[{
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
        }],
        replies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }],
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
    
    }, { timestamps: true }
)

const Comment = mongoose.model('Comment', commentSchema);

const replySchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reply: { type: String, required: true },
        numLikes : {type:Number,default:0},
        likes :[{
            type: mongoose.Schema.Types.ObjectId, ref: 'User',
        }],
        comment :{type: mongoose.Schema.Types.ObjectId, ref:'Comment', required : true, maxlength: 50}
    }
)
const Reply = mongoose.model('Reply',replySchema);
module.exports = { Comment,Reply };