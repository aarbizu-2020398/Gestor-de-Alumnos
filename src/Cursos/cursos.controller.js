'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from "../configs/mongo.js";
import limiter from '../middlewares/validar-cant-peticiones.js';
import authRoutes from '../auth/auth.routes.js';
import alumnoRoutes from '../Alumnos/alumnos.routes.js';
import maestroRoutes from '../Maestros/maestros.routes.js';
import cursoRoutes from '../Cursos/cursos.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/alumnos", alumnoRoutes);
    app.use("/api/v1/maestros", maestroRoutes);
    app.use("/api/v1/cursos", cursoRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log(' Conexión exitosa con la base de datos');
    } catch (error) {
        console.log(' Error al conectar con la base de datos', error);
        process.exit(1);
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        await conectarDB();
        routes(app);
        app.listen(port, () => {
            console.log(` Servidor corriendo en el puerto ${port}`);
        });
    } catch (err) {
        console.log(` Error al iniciar el servidor: ${err}`);
    }
};
