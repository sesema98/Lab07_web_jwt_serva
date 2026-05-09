import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Habilitar CORS para todos
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas
app.use('/', webRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Validar estado del servidor
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
    console.error('Falta la variable de entorno de MongoDB. Usa MONGODB_URI, MONGO_URI o MONGO_URL.');
    process.exit(1);
}

mongoose.connect(mongoUri, { autoIndex: true })
    .then( async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUsers();
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'Ruta no encontrada' });
    }

    return res.status(404).render('pages/404', {
        title: 'Página No Encontrada',
        pageScript: null,
        pageId: '404',
        bodyClass: 'status-shell',
        showNavbar: false
    });
});

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err);

    if (req.path.startsWith('/api/')) {
        return res.status(err.status || 500).json({
            message: err.message || 'Error interno del servidor'
        });
    }

    if ((err.status || 500) === 403) {
        return res.status(403).render('pages/403', {
            title: 'Acceso Denegado',
            pageScript: null,
            pageId: '403',
            bodyClass: 'status-shell',
            showNavbar: false
        });
    }

    return res.status(err.status || 500).send(err.message || 'Error interno del servidor');
});
