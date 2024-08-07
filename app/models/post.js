const mongoose =require("mongoose");

const postSchema = new mongoose.Schema(
    {
        content: { type: String, required: true, maxlength: 250,require :true },
        image: { type: Buffer },
        imageType: { type: String },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        totalLikes : {type:Number,default:0},
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    },{ timestamps: true });
const Post =mongoose.model('Post',postSchema);

module.exports ={Post};