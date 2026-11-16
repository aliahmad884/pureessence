import { Op } from "sequelize";
import { Product, Versions } from "../schemas.js";
const { res, updateVersion, getAdminToken } = require("../syntaxShorter.js");


export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            await Product.create({
                ...body,
                // pImages: JSON.stringify(body.pImages) 
            })
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
    const adminInfo = await getAdminToken(req);
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const scope = searchParams.get("scope")
    const conditions = [];
    if (id) conditions.push({ id });
    if (slug) conditions.push({ slug });
    console.log(id)
    try {
        if (scope === "customer") {
            if (id || slug) {
                const findOne = await Product.findOne({
                    where: {
                        publish: true,
                        [Op.or]: conditions
                    },
                    attributes: ['id', "pName", "qty", "slug", "price", "sDesc", "descripion", "status", "pImages"]
                })
                if (!findOne) return res({ res: `Product Not found against..` }, 404);
                return res(findOne.dataValues, 200)
            }
            const findAll = await Product.findAll({
                where: { publish: true },
                attributes: ['id', "pName", "qty", "slug", "price", "sDesc", "descripion", "status", "pImages"]
            });
            const data = findAll.map(p => p.dataValues)
            return res(data, 200)
        }
        else if (adminInfo && !scope) {
            if (id || slug) {
                const findOne = await Product.findOne({
                    where: {
                        [Op.or]: conditions
                    }
                })
                if (!findOne) return res({ res: `Product Not found against..` }, 404);
                return res(findOne.dataValues, 200)
            }
            const allProducts = await Product.findAll();
            const data = allProducts.map(p => p.dataValues);
            return res(data, 200)
        }
        return res({ res: 'Unauthorized!' }, 401)
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
            else if (body.reason == "publish_status") {
                await Product.update({ publish: body.isPublish }, { where: { id: body.id } });
                // console.log(updateStatus[0])
                updateVersion('product', Versions)
                return res({ res: "Product Status Updated!" }, 201)
            }
            let record = await Product.update({
                ...body
                // pImages: process.env.NODE_ENV === 'development' ? JSON.stringify(body.pImages) : body.pImages
            }, {

                where: {
                    id: body.id
                }
            })
            updateVersion('product', Versions)
            return res({ res: 'Product Updated Successfully!', updatedRecord: record[0] }, 201)
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
