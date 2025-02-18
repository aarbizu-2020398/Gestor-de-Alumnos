import { Router } from "express";
import { check } from "express-validator";
import { getAlumnos, getAlumnoById, registerAlumno, updateAlumno, updatePassword, deleteAlumno } from "../Alumnos/alumnos.controller.js";
import { existeAlumnoById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js";

const router = Router();


router.get("/", validarJWT, getAlumnos);

router.get(
    "/findAlumno/:id",
    [
        validarJWT,
        check("id", "ID inválido").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ],
    getAlumnoById
);


router.post(
    "/",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("surname", "El apellido es obligatorio").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    registerAlumno
);


router.put(
    "/:id",
    [
        validarJWT,
        tieneRol("STUDENT_ROLE"),
        uploadProfilePicture.single("profilePicture"),
        check("id", "ID inválido").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ],
    updateAlumno
);


router.put(
    "/updatePassword/:id",
    [
        validarJWT,
        check("id", "ID inválido").isMongoId(),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    updatePasswordAlumno
);


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRol("STUDENT_ROLE"),
        check("id", "ID inválido").isMongoId(),
        check("id").custom(existeAlumnoById),
        validarCampos
    ],
    deleteAlumno
);


router.post(
    "/asignarCurso",
    [
        validarJWT,
        tieneRol("STUDENT_ROLE"),
        check("studentId", "ID de alumno inválido").isMongoId(),
        check("courseId", "ID de curso inválido").isMongoId(),
        validarCampos
    ],
    asignarCurso
);


router.post(
    "/desasignarCurso",
    [
        validarJWT,
        tieneRol("STUDENT_ROLE"),
        check("studentId", "ID de alumno inválido").isMongoId(),
        check("courseId", "ID de curso inválido").isMongoId(),
        validarCampos
    ],
    desasignarCurso
);

export default router;
