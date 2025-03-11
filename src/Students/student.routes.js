import { Router } from "express";
import { check } from "express-validator";
import { getStudents, createStudent, assignCourse, updateStudent, deleteStudent, getStudentCourses} from "../Students/student.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get("/", getStudents);

router.post(
    "/",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("surname", "El apellido es obligatorio").not().isEmpty(),
        check("email", "El correo es obligatorio").isEmail(),
        check("password", "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),
        validarCampos
    ],
    createStudent
);

router.post(
    "/assign-course/:id",
    [
        validarJWT,
        tieneRole("STUDENT_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        check("courseId", "El ID del curso es obligatorio").not().isEmpty(),
        validarCampos
    ],
    assignCourse
);

router.put(
    "/:id",
    [
        validarJWT,
        tieneRole("STUDENT_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    updateStudent
);

router.delete(
    "/:id",
    [
        validarJWT,
        tieneRole("STUDENT_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    deleteStudent
);

router.get(
    "/courses/:id", 
    [
        validarJWT,
        tieneRole("STUDENT_ROLE"),
        check("id", "No es un ID válido").isMongoId(),
        validarCampos
    ],
    getStudentCourses
);

export default router;