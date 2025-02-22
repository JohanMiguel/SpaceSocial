import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }
}, {
    versionKey: false,
    timeStamps: true
});

export default model("Comment", commentSchema);