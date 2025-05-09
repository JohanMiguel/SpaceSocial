import { Router } from "express";
import { createComment, deleteComment } from "./comment.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();

/**
 * @swagger
 * /comments/addComment:
 *   post:
 *     summary: Add a new comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/addComment", createComment);
/**
 * @swagger
 * /comments/deleteComment/{id}:
 *   delete:
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       500:
 *         description: Server error
 */
router.delete("/deleteComment/:id", validateJWT, hasRoles("ADMIN_ROLE"), deleteComment);

export default router;