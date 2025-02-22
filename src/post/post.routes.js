import { Router } from "express";
import { publicarPost, getPostsByCategory, updatePost, deletePost  } from "./post.controller.js";
import { createPostValidator, updatePostValidator, deletePostValidator } from "../middlewares/post-validator.js";

const router = Router();

router.post("/publicarPost", createPostValidator, publicarPost);
router.get("/postByCategory", getPostsByCategory);
router.put("/updatePost/:uid", updatePostValidator, updatePost);
router.delete("/deletePost/:uid", deletePostValidator, deletePost);



export default router;