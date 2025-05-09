import { Router } from "express";
import { publicarPost, updatePost, deletePost, getAllPosts, getPostById} from "./post.controller.js";
import { createPostValidator, updatePostValidator, deletePostValidator } from "../middlewares/post-validator.js";

const router = Router();

/**
 * @swagger
 * /posts/publicarPost:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/publicarPost", createPostValidator, publicarPost);

/**
 * @swagger
 * /posts/updatePost/{post_id}:
 *   put:
 *     summary: Update a post
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/updatePost/:uid", updatePostValidator, updatePost);
/**
 * @swagger
 * /posts/deletePost/{post_id}:
 *   delete:
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted
 *       500:
 *         description: Server error
 */
router.delete("/deletePost/:uid", deletePostValidator, deletePost);
router.get("/", getAllPosts);
router.get("/buscar/:post_id", getPostById);

export default router;