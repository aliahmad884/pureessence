// import { oauth2 } from "@googleapis/oauth2";
import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
)

export async function GET(req) {
    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    })
    return NextResponse.redirect(url)
}