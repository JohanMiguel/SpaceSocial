import { Schema, model } from "mongoose";

const postsSchema = Schema({
    title: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: false
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
},
{
    versionKey: false,
    timeStamps: true
})

export default model("Post", postsSchema);