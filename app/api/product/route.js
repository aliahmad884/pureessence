import Product, { Category } from "../schemas"
import { res } from "../syntaxShorter"

export async function GET(req) {
    console.log('Get Request Recieved')
    return res({ res: 'Get Request Recieved' })
}
export async function POST(req) {
    let body = await req.json()
    console.log(body)
    const newProduct = Category.create({
        CategoryName: 'Honey',
        Products: JSON.stringify([
            { name: 'Honey Sticks', Qty: '12' },
            { name: 'Orange Honey', code: '45' }
        ])
    })
    console.log("New Category ID: ", (await newProduct).Id)
    return res({ res: "Post Request Recieved", PId: (await newProduct).Id })
}