import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { RegisterUser } from "../../schemas";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            const { name, email, picture, given_name, family_name } = profile;
            const checkuser = await RegisterUser.findOne({ where: { Email: email } })
            if (!checkuser) {
                return `/signup?FirstName=${given_name}&LastName=${family_name}&Email=${email}&authMethod=google`
            }
            return `/login?Name=${name}&Email=${email}&authMethod=google`
        }
    },
    session: {
        strategy: 'jwt'
    }
})

export { handler as GET, handler as POST };