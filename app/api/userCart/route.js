import { where } from 'sequelize';

const { res } = require('../syntaxShorter.js')
const { Cart } = require("../schemas.js")
const jwt = require('jsonwebtoken')

export async function GET(req) {
    const accessToken = req.cookies.get('token')?.value;
    if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    try {
        const decode = jwt.verify(accessToken, 'secretKey')
        const cart = await Cart.findAll({
            where: {
                userId: decode.email
            }
        })
        if (cart) {
            const cartItems = cart.map(items => items.dataValues)
            return res({ cartData: cartItems }, 200)
        }
        return res({ res: 'something went wrong while fetching cart items!' }, 404)
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError') return res({ res: 'something went wrong! please check your access token or secret key' }, 401);
        else if (err.name === 'TokenExpiredError') return res({ res: 'Token has expired!' }, 401);
        console.error(err)
        return res({ err: 'Internel Server Error!' }, 500);
    };
}

export async function POST(req) {
    const accessToken = req.cookies.get('token')?.value;
    if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    const body = await req.json()
    try {
        const decode = jwt.verify(accessToken, 'secretKey')
        const found = await Cart.findOne({
            where: {
                title: body.title,
                userId: decode.email
            }
        })
        if (found) return res({ res: 'item already exists!' }, 400)
        const addNew = await Cart.create({
            userId: decode.email,
            imgUrl: body.imgUrl,
            title: body.title,
            price: body.price,
            qty: body.qty
        })
        // console.log(addNew)
        return res({ res: addNew }, 201)
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError') return res({ res: 'something went wrong! please check your access token or secret key' }, 401);
        else if (err.name === 'TokenExpiredError') return res({ res: 'Token has been expired!' }, 401);
        console.error(err)
        return res({ err: 'Internel Server Error!' }, 500);
    };
}

export async function DELETE(req) {
    const accessToken = req.cookies.get('token')?.value;
    if (!accessToken) return res({ res: "Unauthorized! no token provided" }, 401)
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const body = await req.json();
    try {
        if (action === 'delAll') {
            await Cart.destroy({ where: { userId: body.email } })
            let update = await Cart.findAll({ where: { userId: body.email } })
            let updateData = update.map(data => data.dataValues)
            return res({ res: 'Reques Recieved', data: updateData }, 200)
        }
        const found = await Cart.findOne({
            where: {
                id: body.id,
                userId: body.user
            }
        })
        if (found) {
            await found.destroy()
            const updateData = await Cart.findAll({ where: { userId: body.user } })
            const data = updateData.map(data => data.dataValues)
            return res({ res: 'Item Deleted successfully', data: data }, 201)
        }
        return res({ res: "Not Found" }, 404)
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError') return res({ res: 'something went wrong! please check your access token or secret key' }, 401);
        else if (err.name === 'TokenExpiredError') return res({ res: 'Token has been expired!' }, 401);
        console.error(err)
        return res({ err: 'Internel Server Error!' }, 500);
    };
}