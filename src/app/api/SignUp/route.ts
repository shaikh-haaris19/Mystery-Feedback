import connectDB from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserModel";
import bcrypt from "bcrypt";
import sendVerificationEmail from "@/Helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {

    // Connect to the database
    await connectDB();

    try {

        const { userName, email, password } = await request.json();

        // Check if the user already exists With The Username And is Also Verified
        const existingVerifiedUserWithUsername = await User.findOne({ userName, isVerified: true });

        if (existingVerifiedUserWithUsername) {
            return NextResponse.json({ success: false, message: "Username already Taken" }, { status: 400 });
        }

        // Check if the user already exists With The Email
        const existingVerifiedUserWithEmail = await User.findOne({ email });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

        if (existingVerifiedUserWithEmail) {

            if (existingVerifiedUserWithEmail.isVerified) {
                return NextResponse.json({ success: false, message: "Email already Registered" }, { status: 400 });
            }
            else {

                // If the user exists but is not verified, we can proceed with the registration To update the existing user with the new password and verification code.

                // Generate Salt and Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //Generate a verification code Of 6 digits and its expiry date
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry date to 1 hour from now

                // Update the existing user with the new password, verification code, and expiry date
                existingVerifiedUserWithEmail.password = hashedPassword;
                existingVerifiedUserWithEmail.verifyCode = verificationCode;
                existingVerifiedUserWithEmail.verifyCodeExpiry = expiryDate;

                await existingVerifiedUserWithEmail.save();

            }

        }
        else {

            // Generate Salt and Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            //Generate a expiry date for the verification code
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry date to 1 hour from now

            // Create a new user
            const newUser = new User({
                userName,
                email: email,
                password: hashedPassword,
                verifyCode: verificationCode, // Verification code for email verification
                verifyCodeExpiry: expiryDate, // Set the expiry date for 1 hour 
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();

        }

        // Send the verification email to the user
        const emailSent = await sendVerificationEmail(userName, email, verificationCode);

        if (!emailSent.success) {
            return NextResponse.json({ success: false, message: "Error while sending verification email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "User registered successfully.Please verify your email.", verificationCode }, { status: 201 });


    } catch (error) {
        console.error("Error While Registering User:", error);
        return NextResponse.json({ success: false, message: "Error while registering user" }, { status: 500 });
    }

}