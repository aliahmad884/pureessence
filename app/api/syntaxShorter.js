import { NextResponse } from "next/server"
const bcrypt = require("bcrypt")

const updateVersion = async (entryKey, table) => {
    let ver = await table.findOne({ where: { key: entryKey } })
    let preVersion = ver.dataValues.version;
    try {
        let update = await table.update({
            version: Number(preVersion) + 1
        }, { where: { key: entryKey } })
        console.log(entryKey, update)
        return update;
    }
    catch (err) {
        console.log('Error when updating Version')
        console.error(err)
        return null;
    }
};

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

let characters = 'gklmABCDEFGHIJOPQR7898464opqrSTUVWXYZabcd6464321fdsfwqergb6565efghinst23165414uKLMNvwxyz'
const randomeStrGen = (length) => {
    let str = ''
    for (let i = 0; i < 10 + length; i++) {
        str += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return str;
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

module.exports = { res, sanitizer, randomeStrGen, updateVersion }
