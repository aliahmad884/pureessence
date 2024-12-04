import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { readFileSync, existsSync } from 'fs';
const { res } = require('../syntaxShorter.js')

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const parampPath = searchParams.get('path');
    const splitPath = parampPath.split('/');
    const filename = splitPath[splitPath.length - 1]
    const fileDir = splitPath[1];
    const fileExt = path.extname(filename).toLowerCase().slice(1)
    const destPath = path.join(process.cwd(), 'public', fileDir, filename);

    if (existsSync(destPath)) {
        const fileBuffer = readFileSync(destPath)
        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': `images/${fileExt}`
            }
        })
    }

    return res({ res: "file not found" }, 404)
}

export async function POST(req) {
    const { searchParams } = new URL(req.url)
    const destPath = searchParams.get('path')
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return res({ res: 'File Not recieved' }, 400);
    const buffer = Buffer.from(await file.arrayBuffer())
    let fileDest = `/${destPath}/${file.name}`
    try {
        await writeFile(path.join(process.cwd(), `public/${destPath}/${file.name}`), buffer)
        return res({ res: 'Img Uploaded', path: `/api/uploadImg?path=${encodeURIComponent(fileDest)}`, location: `/api/uploadImg?path=${encodeURIComponent(fileDest)}` }, 200)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get('path')
    try {
        await unlink(path.join(process.cwd(), `public/${filePath}`))
        return res({ res: 'Img Deleted' }, 200)
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            return res({ res: 'Img not found' }, 404)
        }
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}