import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export default function middleware(req) {
    const token = req.cookies.get('session_token')
    console.log('token', token)
    if (!token) {
        return NextResponse.json({ res: 'unauthorized, token missing!' }, { status: 401 })
    }
    try {
        console.log('updating token')
        const decoded = jwt.verify(token, 'secretkey');
        const newToken = jwt.sign({ username: decoded.username }, 'secretkey', { expiresIn: '1min' })
        const response = NextResponse.next();
        response.cookies.set('session_token', newToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            path: '/admin',
            maxAge: 60 * 1 //one min for testing
        })
        return response;
    }
    catch (err) {
        console.error(err)
        return NextResponse.json({ err: err }, { status: 401 })
    }

}