const { Blogs } = require('../schemas.js')
const { res } = require("../syntaxShorter.js");



export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            const newBlog = await Blogs.create(body)
            return res({ res: 'Blog Added Successfully!', id: newBlog.id }, 201)
        }
        return res({ res: "Blog Body Not Recieved!" }, 404)
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
            const findById = await Blogs.findByPk(id)
            if (findById === null) return res({ res: `Blog Not found against id: ${id}` }, 404)
            else return res(findById.dataValues, 200)
        }
        const blogs = await Blogs.findAll()
        if (blogs) {
            const data = blogs.map(blog => blog.dataValues)
            return res(data, 200)
        }
        return res({ res: 'Blog Not Found!' }, 404)
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
            const found = await Blogs.findByPk(body.Id)
            if (found === null) return res({ res: `Blog Not found against id: ${body.Id}` }, 404)
            else {
                await Blogs.update(body, {
                    where: {
                        Id: body.Id
                    }
                })
                return res({ res: 'Blog Updated Successfully!' }, 201)
            }
        }
        return res({ res: "Blog Body Not Recieved!" }, 404)
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
            const find = await Blogs.findByPk(id)
            if (find === null) return res({ res: `Blog Not found against param id: ${id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'Blog Deleted Successfully against id: ' + id }, 201)
            }
        }
        if (body.Id) {
            const find = await Blogs.findByPk(body.Id);
            if (find === null) return res({ res: `Blog Not found against body id: ${body.Id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'Blog Deleted Successfully against id: ' + body.Id }, 201)
            }
        }
        return res({ res: 'Blog Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
