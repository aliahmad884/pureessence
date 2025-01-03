import ProductData from "@/data.js";
import { Product, Versions } from "../schemas.js";
const { res, updateVersion } = require("../syntaxShorter.js");


export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            await Product.create({ ...body, pImages: JSON.stringify(body.pImages) })
            updateVersion('product', Versions)
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
            if (findById === null) return res({ res: `Data Not found against id: ${id}` }, 404);
            let data = { ...findById.dataValues, pImages: JSON.parse(findById.dataValues.pImages) }
            // for (let i = 0; i < ProductData.length; i++) {
            //     await Product.create({
            //         pName: ProductData[i].title,
            //         slug: ProductData[i].slug,
            //         sDesc: ProductData[i].shortDes,
            //         description: ProductData[i].description,
            //         price: ProductData[i].price,
            //         pImages: JSON.stringify([ProductData[i].imgUrl]),
            //         qty: ProductData[i].qty,
            //         status: 'in stock',
            //         pageTitle: ProductData[i].title,
            //         metaDesc: ProductData[i].description,
            //         reviews: null,
            //         category: null
            //     })
            //     console.log(`Product ${ProductData[i].title} has been Inserted to DataBase`)
            // }
            return res(data, 200)
        }
        else if (pSlug) {
            const findBySlug = await Product.findOne({ where: { slug: pSlug } })
            if (findBySlug === null) return res({ res: `Product Not found against Slug: ${pSlug}` }, 404);
            let data = { ...findBySlug.dataValues, pImages: JSON.parse(findBySlug.dataValues.pImages) }
            return res(data, 200)
        }
        const products = await Product.findAll()
        if (products) {
            const data = products.map(product => ({ ...product.dataValues, pImages: JSON.parse(product.dataValues.pImages) }))
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
                let record = await Product.update({ ...body, pImages: JSON.stringify(body.pImages) }, {
                    where: {
                        id: body.id
                    }
                })
                updateVersion('product', Versions)
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
            updateVersion('product', Versions)
            return res({ res: 'Data Deleted Successfully against id: ' + id }, 202)
        }
        return res({ res: 'Products Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
