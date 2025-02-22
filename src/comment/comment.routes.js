import { Router } from "express";
import { createComment, updateComment, deleteComment } from "./comment.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";

const router = Router();


router.post("/addComment", validateJWT, hasRoles("USER_ROLE"), createComment);
router.put("/updateComment/:id", validateJWT, hasRoles("USER_ROLE"), updateComment);
router.delete("/deleteComment/:id", validateJWT, hasRoles("USER_ROLE"), deleteComment);

export default router;