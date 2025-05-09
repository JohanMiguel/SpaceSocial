import { Router } from "express"
import { login} from "./auth.controller.js"
import { loginValidator } from "../middlewares/user-validators.js"

const router = Router()



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/login",loginValidator,login)

export default router