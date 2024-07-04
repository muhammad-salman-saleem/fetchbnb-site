import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"
import { compare } from "bcryptjs"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        }),
        CredentialsProvider({
            name: 'Credentials',
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email.toLowerCase()
                    }
                })
                if (!user) {
                    return null //No user with email found
                }
                const checkPassword = await compare(credentials.password, user.password);
                if (!checkPassword || user.email.toLowerCase() !== credentials.email.toLowerCase()) {
                    return null //Username or Password doesn't match
                }
                delete user.password;
                return user
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        jwt: async({ token, user }) => {
            user && (token.user = user)
            return token
        },
        session: async({ session, token }) => {
            session.user = token.user;
            session.jti = token.jti;
            if (token.user.id) {
                const updatedUser = await prisma.user.findFirst({
                    where: {
                        id: token.user.id
                    }
                })
                delete updatedUser.password;
                session.user = {...updatedUser };
                token.user = {...updatedUser };
            }

            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
}
export default NextAuth(authOptions)