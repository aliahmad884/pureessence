import path from 'path';
import { writeFile, readFile, unlink } from 'fs/promises';
import { readFileSync } from 'fs';
const { res } = require('../syntaxShorter.js')

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const destPath = searchParams.get('test')
    console.log(destPath)
    return res({ res: "request recieved" }, 200)
}

export async function POST(req) {
    const { searchParams } = new URL(req.url)
    const destPath = searchParams.get('path')
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file) return res({ res: 'File Not recieved' }, 400);
    const buffer = Buffer.from(await file.arrayBuffer())
    try {
        await writeFile(path.join(process.cwd(), `public/${destPath}/${file.name}`), buffer)
        return res({ res: 'Img Uploaded', path: `/${destPath}/${file.name}`, location: `/${destPath}/${file.name}` }, 200)
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