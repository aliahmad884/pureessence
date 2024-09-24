const { Product } = require('../schemas.js')
const { res } = require("../syntaxShorter.js");



export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            const newProduct = await Product.create(body)
            return res({ res: 'Product Added Successfully!', id: newProduct.id }, 201)
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
    let id = searchParams.get('id')
    try {
        if (id) {
            const findById = await Category.findByPk(id)
            if (findById === null) return res({ res: `Data Not found against id: ${id}` }, 404)
            else return res(findById.dataValues, 200)
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
            const found = await Product.findByPk(body.Id)
            if (found === null) return res({ res: `Product Not found against id: ${body.Id}` }, 404)
            else {
                await Product.update(body, {
                    where: {
                        Id: body.Id
                    }
                })
                return res({ res: 'Product Updated Successfully!' }, 201)
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
    const body = await req.json()
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('id')
    console.log(body)
    try {
        if (id) {
            const find = await Product.findByPk(id)
            if (find === null) return res({ res: `Data Not found against param id: ${id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'Data Deleted Successfully against id: ' + id }, 202)
            }
        }
        if (body.id) {
            const find = await Product.findByPk(body.id);
            if (find === null) return res({ res: `Data Not found against body id: ${body.id}` }, 404)
            else {
                await find.destroy()
                return res({ res: 'Data Deleted Successfully against id: ' + body.id }, 201)
            }
        }
        return res({ res: 'Products Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
