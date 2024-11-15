const { Product } = require('../schemas.js')
const { res } = require("../syntaxShorter.js");



export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            await Product.create({
                pName: body.pName,
                slug: body.slug,
                sDesc: body.sDesc,
                description: body.description,
                price: body.price,
                pImages: body.pImages,
                qty: body.qty,
                pageTitle: body.pageTitle,
                metaDesc: body.metaDesc,
                reviews: null,
                category: null
            })
            return res({ res: 'Product Added Successfully!' }, 201)
        }
        return res({ res: "Product Body Not Recieved!" }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}


export async function GET(req) {
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('pId')
    let pSlug = searchParams.get('slug')
    try {
        if (id) {
            const findById = await Product.findByPk(id)
            if (findById === null) return res({ res: `Data Not found against id: ${id}` }, 404)
            return res(findById.dataValues, 200)
        }
        else if (pSlug) {
            const findBySlug = await Product.findOne({ where: { slug: pSlug } })
            if (findBySlug === null) return res({ res: `Product Not found against Slug: ${pSlug}` }, 404)
            return res(findBySlug.dataValues, 200)
        }
        const products = await Product.findAll()
        if (products) {
            const data = products.map(product => product.dataValues)
            return res(data, 200)
        }
        return res({ res: 'Products Data Not Found!' }, 404)
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
            const found = await Product.findByPk(body.id)
            if (found === null) return res({ res: `Product Not found against id: ${body.id}` }, 404)
            else {
                let record = await Product.update(body, {
                    where: {
                        id: body.id
                    }
                })
                return res({ res: 'Product Updated Successfully!', updatedRecord: record[0] }, 201)
            }
        }
        return res({ res: "Product Body Not Recieved!" }, 404)
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
            console.log("Product ID: ", id)
            const find = await Product.findByPk(id)
            // console.log(find)
            if (find === null) return res({ res: `Data Not found against param id: ${id}` }, 404)
            await find.destroy()
            return res({ res: 'Data Deleted Successfully against id: ' + id }, 202)
        }
        return res({ res: 'Products Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
