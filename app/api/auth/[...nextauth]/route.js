import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { RegisterUser } from "../../schemas";
import { appendFileSync, existsSync, mkdirSync } from 'fs'
import path from "path";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            const logFile = path.join(process.cwd(), 'logs/google/logs.txt');
            const dirPath = path.dirname(logFile);
            if (!existsSync(dirPath)) {
                mkdirSync(dirPath, { recursive: true });
            }
            try {
                appendFileSync(logFile, 'api called by google')
                const { name, email, picture, given_name, family_name } = profile;
                const checkuser = await RegisterUser.findOne({ where: { Email: email } })
                if (!checkuser) {
                    return `/signup?FirstName=${given_name}&LastName=${family_name}&Email=${email}&authMethod=google`
                }
                return `/login?Name=${name}&Email=${email}&authMethod=google`
            }
            catch (err) {
                appendFileSync(logFile, '"Google OAuth Error:"')
                appendFileSync(logFile, err.message)
            }
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        }
    },
    session: {
        strategy: 'jwt'
    }
})

export { handler as GET, handler as POST };