import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Set up the Multer storage configuration
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadDir = path.join(process.cwd(), '/public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });



export async function POST(req) {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, {}, (err) => {
            if (err) {
                console.error('Upload error:', err);
                return reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }

            const file = req.file;

            if (!file) {
                const errorMessage = 'No file uploaded';
                console.error(errorMessage);
                return reject(new Response(JSON.stringify({ error: errorMessage }), { status: 400 }));
            }

            resolve(new Response(JSON.stringify({
                message: 'File uploaded successfully',
                file: {
                    filename: file.filename,
                    path: `/uploads/${file.filename}`,
                },
            }), { status: 200 }));
        });
    });
}
