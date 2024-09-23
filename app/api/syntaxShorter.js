import { NextResponse } from "next/server"

export const res = (body, code = 200, authHeader) => {
    let headers = {
        "Content-Type": 'application/json',
        ...(authHeader && { 'X-Auth': authHeader })
    }
    return NextResponse.json(body, {
        status: Number(code),
        headers: headers
    })
}

