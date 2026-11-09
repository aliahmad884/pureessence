import { cookies } from "next/headers";
import { AdminUser } from "../api/schemas.js";
import jwt from "jsonwebtoken"

export async function getUserInfo() {
    const cookieStore = await cookies()
    const token = cookieStore.get("adminAuth")?.value
    if (token) {
        const decryptToken =jwt.verify(token, process.env.JWT_SEC_KEY)
        const user=await AdminUser.findOne({ where: { id: decryptToken?.id } })
        return user?.dataValues;
    }
    return null;
}