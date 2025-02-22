import { body, param } from "express-validator";
import { validarCampos} from "./validate-fields.js";
import { categoryExists } from "../helpers/db-validators.js"
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";


export const saveCategoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name").notEmpty().withMessage("El nombre es requerido"),
    validarCampos,
    handleErrors
]


export const deleteCategoryValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("categoria_id").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("categoria_id").custom(categoryExists),
    validarCampos,
    handleErrors
]


export const updateCtaegory = [
    param("categoria_id").isMongoId().withMessage("No es un Id valido en MongoBD2"),
    param("categoria_id").custom(),
    validarCampos,
    handleErrors
]