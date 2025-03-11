export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                success: false,
                msg: "Se quiere verificar un rol, pero no se ha validado el token primero"
            });
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                success: false,
                msg: `Usuario no autorizado. Posee el rol ${req.usuario.role}, pero los roles autorizados son: ${roles.join(", ")}`
            });
        }

        next();
    };
};