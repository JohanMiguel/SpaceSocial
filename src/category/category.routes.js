import { Router } from "express";
import { createCategory,getCategoryByName,getCategorys, updateCategory, deleteCategory} from "./category.controller.js";
import { saveCategoryValidator, deleteCategoryValidator} from "../middlewares/category-validatos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
const router = Router()

/**
 * @swagger
 * /categories/saveCategory:
 *   post:
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/saveCategory", saveCategoryValidator, createCategory);

/**
 * @swagger
 * /categories/buscarCategory/{name}:
 *   get:
 *     summary: Get category by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/buscarCategory/:name", getCategoryByName);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get("/", getCategorys);

/**
 * @swagger
 * /categories/editar/{categoria_id}:
 *   put:
 *     summary: Update a category
 *     parameters:
 *       - in: path
 *         name: categoria_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/editar/:categoria_id", updateCategory);

/**
 * @swagger
 * /categories/deleteCategory/{categoria_id}:
 *   delete:
 *     summary: Delete a category
 *     parameters:
 *       - in: path
 *         name: categoria_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       500:
 *         description: Server error
 */
router.delete("/deleteCategory/:categoria_id", deleteCategoryValidator, deleteCategory);

export default router;