import { NextResponse } from "next/server.js";
import { RegisterUser } from "../../schemas.js";

const { res } = require("../../syntaxShorter.js")
const { OAuth2Client } = require("google-auth-library")
import { appendFileSync, existsSync, mkdirSync } from 'fs'
import path from "path";

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
)

export async function GET(req) {
    const logFile = path.join(process.cwd(), 'logs/google/logs.txt');
    const dirPath = path.dirname(logFile);
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
    }
    appendFileSync(logFile, 'api called by google')
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code');
    if (!code) {
        appendFileSync(logFile, 'Authorization code is missing!')
        return res({ err: 'Authorization code is missing!' }, 400);
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(tokens);

        // Fetch user info from Google
        const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        if (!response.ok) {
            appendFileSync(logFile, 'Failed to fetch user info.')
            throw new Error("Failed to fetch user info.");
        }

        const userInfo = await response.json();
        const checkuser = await RegisterUser.findOne({ where: { Email: userInfo.email } });
        if (!checkuser) {
            return NextResponse.redirect(`${process.env.BASE_URL}/signup?FirstName=${userInfo.given_name}&LastName=${userInfo.family_name}&Email=${userInfo.email}&authMethod=google`)
        }
        else {
            return NextResponse.redirect(`${process.env.BASE_URL}/login?Name=${userInfo.name}&Email=${userInfo.email}&authMethod=google`)
        }
        // return NextResponse.redirect(process.env.BASE_URL)
        // return res(userInfo, 200)

    }
    catch (error) {
        appendFileSync(logFile, '"Google OAuth Error:"')
        appendFileSync(logFile, error.message)
        console.error("Google OAuth Error:", error.message);
        return res({ err: 'failed to fetch user information!' }, 500)
    }
}