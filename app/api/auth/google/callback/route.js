
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { RegisterUser } from "@/app/api/schemas";
import jwt from "jsonwebtoken";

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 3,
    path: '/',
};

export async function GET(request) {

    try {
        const { searchParams } = new URL(request.url);

        const code = searchParams.get("code");
        const returnedState = searchParams.get("state");
        const error = searchParams.get("error");

        const savedState = request.cookies.get(
            "googleOAuthState"
        )?.value;

        if (error) {
            return NextResponse.redirect(
                new URL("/login?err=GOOGLE_CANCELLED", request.url)
            );
        }

        if (!savedState || savedState !== returnedState) {
            return NextResponse.json(
                { error: "Invalid OAuth state" },
                { status: 403 }
            );
        }

        if (!code) {
            return NextResponse.json(
                { error: "Authorization code missing" },
                { status: 400 }
            );
        }

        const { tokens } = await oauth2Client.getToken(code);

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload?.email || payload.email_verified !== true) {
            throw new Error("Google email is not verified");
        }

        const {
            sub,
            email,
            given_name,
            family_name,
            picture
        } = payload;

        const found = await RegisterUser.findOne({ where: { Email: email } })
        let user;
        if (!found) {
            console.log("User not existed, registering...")
            user = await RegisterUser.create({
                first_name: given_name,
                last_name: family_name,
                email: email,
                password: null,
                profile_pic: picture,
                reg_date: Date.now(),
                last_login: Date.now(),
                AuthMethod: "google"
            });
        } else user = found;
        console.log("User already registered, logging in....")
        const { Password, ...userInfo } = user.dataValues
        const authToken = jwt.sign(userInfo, process.env.JWT_USER_KEY, { expiresIn: '3d' })
        const response = NextResponse.redirect(new URL("/", request.url))
        response.cookies.set('token', authToken, cookieOptions)
        return response;

    } catch (error) {
        console.error("Google OAuth Error:", error);

        return NextResponse.json(
            { error: "Google authentication failed" },
            { status: 500 }
        );
    }
}
