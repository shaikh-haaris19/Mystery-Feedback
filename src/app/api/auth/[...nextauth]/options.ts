import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth"
import bcrypt from "bcrypt";
import User from "@/models/UserModel";
import connectDB from "@/lib/connectDB";

export const authOptions: NextAuthOptions = {
    // Credentials Provider & GitHub Provider
    providers: [

        CredentialsProvider({

            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",

            // This is the description for the sign in form.
            credentials: {
                identifier: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any) {

                await connectDB();

                try {

                    const user = await User.findOne({
                        $or: [
                            { userName: credentials.identifier },
                            { email: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email before logging in.");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        _id: user._id.toString(),
                        email: user.email,
                        userName: user.userName,
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessages,
                    };

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })

    ],
    // Callbacks for JWT and Session
    callbacks: {
        async signIn({ user, account }) {

            if (account?.provider === "github") {

                await connectDB();

                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {

                    const newUser = new User({
                        userName: `GITHUB_USER_${user.name}`,
                        email: user.email,
                        isVerified: true,
                        isAcceptingMessages: true,
                        messages: []
                    });

                    await newUser.save();

                }

            }

            return true;

        },
        async jwt({ token, user }) {

            if (user) {
                token.id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.userName = user.userName
            }

            return token

        },
        async session({ session, token }) {

            if (token) {
                session.user._id = token.id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.userName = token.userName
            }

            return session
        }
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)