import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function getUserInfo(authToken,schema,key) {
    const cookieStore = await cookies()
    const token = cookieStore.get(authToken)?.value
    if (token) {
        const decryptToken =jwt.verify(token, key)
        const user=await schema.findOne({ where: { id: decryptToken?.id } })
        return user?.dataValues;
    }
    return null;
}