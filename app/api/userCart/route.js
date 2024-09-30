import { where } from 'sequelize';

const { res } = require('../syntaxShorter.js')
const { Cart } = require("../schemas.js")
const jwt = require('jsonwebtoken')
const sequelize = require('../dbConnection.js')

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
        const addNew = await Cart.create({
            id: body.id,
            userId: decode.email,
            imgUrl: body.imgUrl,
            title: body.title,
            price: body.price,
            qty: body.qty
        })
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
        const decode = jwt.verify(accessToken, 'secretKey')

        if (action === 'delAll') {
            await Cart.destroy({ where: { userId: body.email } })
            let update = await Cart.findAll({ where: { userId: decode.email } })
            let updateData = update.map(data => data.dataValues)
            return res({ res: 'Request Recieved', data: updateData }, 200)
        }
        const found = await Cart.destroy({
            where: {
                id: body.id,
                userId: decode.email
            }
        })

        if (found > 0) {
            return res({ res: 'Item Deleted successfully' }, 201)
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