import { Router } from "express";
import { check } from "express-validator";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../Courses/course.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getCourses);

router.post(
    "/",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("name", "El nombre del curso es obligatorio").not().isEmpty(),
        check("description", "La descripción es obligatoria").not().isEmpty(),
        check("teacherId", "El ID del profesor es obligatorio").isMongoId(),
        validarCampos
    ],
    createCourse
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updateCourse
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteCourse
);

export default router;