const mongoose =require("mongoose");
const commentSchema = new mongoose.Schema(
    {   
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        replies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
    
    }, { timestamps: true }
)

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };