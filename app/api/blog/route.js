const { Blogs, Versions } = require('../schemas.js')
const { res, updateVersion } = require("../syntaxShorter.js");

export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            await Blogs.create({ ...body, date: Date.now() })
            updateVersion('blog', Versions)
            return res({ res: 'Blog Added Successfully!', }, 201)
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
    let slug = searchParams.get('slug')
    let id = searchParams.get('bId')
    let getVersion = searchParams.get('getVersion')
    try {
        if (id) {
            const findById = await Blogs.findByPk(id)
            if (findById === null) return res({ res: `Data Not found against id: ${id}` }, 404)
            return res(findById.dataValues, 200)
        }
        else if (getVersion) {
            const findVersion = await Versions.findOne({ where: { key: 'blog' } })
            if (findVersion === null) return res({ res: `Version Not found against blog` }, 404)
            else return res(findVersion.dataValues, 200)
        }
        else if (slug) {
            const findBySlug = await Blogs.findOne({ where: { bSlug: slug } })
            if (findBySlug === null) return res({ res: `Blog Not found against Slug: ${slug}` }, 404)
            else return res(findBySlug.dataValues, 200)
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
            console.log(body.id)
            const found = await Blogs.findByPk(body.id)
            console.log(found)
            if (found === null) return res({ res: `Blog Not found against id: ${body.id}` }, 404)
            else {
                await Blogs.update(body, {
                    where: {
                        Id: body.id
                    }
                })
                updateVersion('blog', Versions)
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
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('id')
    try {
        if (id) {
            const find = await Blogs.findByPk(id)
            if (find === null) return res({ res: `Blog Not found against param id: ${id}` }, 404)
            else {
                await find.destroy()
                updateVersion('blog', Versions)
                return res({ res: 'Blog Deleted Successfully against id: ' + id }, 201)
            }
        }
        return res({ res: 'Blog Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
