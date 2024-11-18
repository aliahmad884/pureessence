import { Pages } from "../schemas.js";

const { res } = require("../syntaxShorter.js");


export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            const newPage = await Pages.create(body)
            return res({ res: 'Page Added Successfully!', id: newPage.id }, 201)
        }
        return res({ res: "Page Body Not Recieved!" }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('id')
    try {
        if (id) {
            const findById = await Pages.findByPk(id)
            if (findById === null) return res({ res: `Page Not found against id: ${id}` }, 404)
            else return res(findById.dataValues, 200)
        }
        const pages = await Pages.findAll()
        if (pages) {
            const data = pages.map(page => page.dataValues)
            return res(data, 200)
        }
        return res({ res: 'Page Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}


export async function PUT(req) {
    const body = await req.json()
    try {
        if (body) {
            const found = await Pages.findByPk(body.Id)
            if (found === null) return res({ res: `Page Not found against id: ${body.Id}` }, 404)
            else {
                await Pages.update(body, {
                    where: {
                        Id: body.Id
                    }
                })
                return res({ res: 'Page Updated Successfully!' }, 201)
            }
        }
        return res({ res: "Page Body Not Recieved!" }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}



export async function DELETE(req) {
    const body = await req.json()
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('id')
    console.log(body)
    try {
        if (id) {
            const find = await Pages.findByPk(id)
            if (find === null) return res({ res: `Page Not found against param id: ${id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'Page Deleted Successfully against id: ' + id }, 201)
            }
        }
        if (body.Id) {
            const find = await Pages.findByPk(body.Id);
            if (find === null) return res({ res: `Page Not found against body id: ${body.Id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'Page Deleted Successfully against id: ' + body.Id }, 201)
            }
        }
        return res({ res: 'Page Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
