import { Router } from "express";
import { check } from "express-validator";
import { getCursos, getCursoById, createCurso, updateCurso, deleteCurso } from "../Cursos/cursos.controller.js";
import { existeCursoById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", validarJWT, getCursos);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos,
    ],
    getCursoById
);

router.post(
    "/",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE", "TEACHER_ROLE"),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("descripcion", "La descripción es obligatoria").not().isEmpty(),
        check("codigo", "El código es obligatorio").not().isEmpty(),
        check("duracion", "La duración es obligatoria y debe ser un número").isNumeric(),
        check("profesor", "El ID del profesor no es válido").isMongoId(),
        validarCampos,
    ],
    createCurso
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE", "TEACHER_ROLE"),
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos,
    ],
    updateCurso
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeCursoById),
        validarCampos,
    ],
    deleteCurso
);

export default router;
