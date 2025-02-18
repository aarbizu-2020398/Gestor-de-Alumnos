import multer from 'multer';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const createMulterConfig = (destinationPath) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const fullPath = join(CURRENT_DIR, destinationPath);
                req.filePath = fullPath;
                cb(null, fullPath);
            },
            filename: (req, file, cb) => {
                const fileExtension = extname(file.originalname);
                const filename = file.originalname.split(fileExtension)[0].replace(/\s+/g, '_'); // Reemplaza espacios con _
                cb(null, `${filename}-${Date.now()}${fileExtension}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`Solo se permiten imágenes en formato: ${ALLOWED_MIMETYPES.join(", ")}`));
            }
        },
        limits: {
            fileSize: MAX_SIZE
        }
    });
};

export const uploadProfilePicture = createMulterConfig("../../public/uploads/profile-pictures");
export const uploadCoursePicture = createMulterConfig("../../public/uploads/course-pictures");
