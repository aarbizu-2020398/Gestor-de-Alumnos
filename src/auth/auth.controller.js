import { Router } from "express";
import { check } from "express-validator";
import { login, registerAlumno, registerMaestro } from "../auth/auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();


router.post(
    "/login",
    [
        check("email", "El email no es válido").optional().isEmail(),
        check("password", "La contraseña es obligatoria").not().isEmpty(),
        validarCampos
    ],
    login
);


router.post(
    "/register/alumno",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("surname", "El apellido es obligatorio").not().isEmpty(),
        check("username", "El nombre de usuario es obligatorio").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("phone", "El número de teléfono debe contener 8 dígitos").isLength({ min: 8, max: 8 }),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    registerAlumno
);


router.post(
    "/register/maestro",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("surname", "El apellido es obligatorio").not().isEmpty(),
        check("username", "El nombre de usuario es obligatorio").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("phone", "El número de teléfono debe contener 8 dígitos").isLength({ min: 8, max: 8 }),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    registerMaestro
);

export default router;
