import mongoose, { Document, Schema } from "mongoose";

// Message Interface
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

// User Interface
export interface User extends Document {
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({

    userName: {
        type: String,
        required: [true, 'Username Is Required'],   //custom message tied to the required property
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email Is Required'],   //custom message tied to the required property
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password Is Required'],  //custom message tied to the required property
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification Code Is Required'],  //custom message tied to the required property
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verification Code Expiry Is Required'], //custom message tied to the required property
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: {
        type: [MessageSchema],
        default: []
    }

})

const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
export default User;