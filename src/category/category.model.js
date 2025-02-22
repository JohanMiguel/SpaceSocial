import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        versionKey: false,
        timestamps: true  
    }
);

const Category = mongoose.model("Category", categorySchema);
export default model("Category", categorySchema);
