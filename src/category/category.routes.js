import { Router } from "express";
import { createCategory,getCategoryByName,getCategorys, updateCategory, deleteCategory} from "./category.controller.js";
import { saveCategoryValidator, deleteCategoryValidator} from "../middlewares/category-validatos.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
const router = Router()


router.post("/saveCategory", saveCategoryValidator, createCategory);
router.get("/buscarCategory/:name", getCategoryByName);
router.get("/", getCategorys);
router.put("/editar/:categoria_id", updateCategory);


router.delete("/deleteCategory/:categoria_id", deleteCategoryValidator, deleteCategory);

  
export default router;