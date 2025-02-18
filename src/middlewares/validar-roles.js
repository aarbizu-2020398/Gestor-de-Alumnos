export const tieneRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: "Es necesario verificar el rol del usuario antes de validar permisos."
            });
        }

        if (!rolesPermitidos.includes(req.usuario.role)) {
            return res.status(403).json({
                success: false,
                msg: `Acceso denegado. Tu rol actual es ${req.usuario.role}, pero se requieren los siguientes roles: ${rolesPermitidos.join(", ")}.`
            });
        }

        next();
    };
}
