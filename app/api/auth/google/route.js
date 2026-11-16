
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { randomBytes } from "crypto";

const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {

    const state = randomBytes(32).toString("hex");

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "online",
        scope: [
            "openid",
            "email",
            "profile"
        ],
        state
    });

    const response = NextResponse.redirect(authUrl);

    response.cookies.set("googleOAuthState", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600
    });

    return response;
}
