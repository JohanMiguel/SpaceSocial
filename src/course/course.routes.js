import { Router } from "express";
import {getCourseByName, getCourses} from "./course.controller.js";
const router = Router();




/**
 * @swagger
 * /courses/buscarCourse/{name}:
 *   get:
 *     summary: Get course by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Course name
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/buscarCourse/:name", getCourseByName);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
router.get("/", getCourses);


export default router;