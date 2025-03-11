import { Router } from "express";
import { check } from "express-validator";
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getTeacherCourses } from "../Teachers/teacher.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", 
    getTeachers);

router.post(
    "/",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("surname", "El apellido es obligatorio").not().isEmpty(),
        check("email", "El correo es obligatorio").isEmail(),
        check("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),
        validarCampos
    ],
    createTeacher
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updateTeacher
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("TEACHER_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteTeacher
);

router.get(
    "/courses/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    getTeacherCourses
);

export default router;