import { NextResponse } from "next/server"
const bcrypt = require("bcrypt")

const res = (body, code = 200, authHeader) => {
    let headers = {
        "Content-Type": 'application/json',
        ...(authHeader && { 'X-Auth': authHeader })
    }
    return NextResponse.json(body, {
        status: Number(code),
        headers: headers
    })
}

const sanitizer = {
    encryptPass: async (pass) => {
        try {
            const passHash = await bcrypt.hash(pass, 10)
            return passHash
        }
        catch (err) {
            console.log('Error during hashing password!', err)
            return;
        }
    },
    decryptPass: async (pass, hash) => {
        try {
            const compPass = await bcrypt.compare(pass, hash)
            return compPass
        }
        catch (err) {
            console.log('Error during compare password!', err)
            return;
        }
    }
}

module.exports = { res, sanitizer }
