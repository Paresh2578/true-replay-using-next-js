import mongoose , {Schema} from "mongoose";

export interface User{
    _id ?: string,
    username : string,
    email : string,
    password : string,
    isVerified : boolean,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isAcceptingMessages : boolean
}

const userScheme : Schema<User> = new Schema({
    username : {
        type:String,
        required : [true,"Username is required"],
        trim : true,
        unique : true
    },
     email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
     verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    }
})

const UserModel = (mongoose.models.user as mongoose.Model<User>) || (mongoose.model<User>("User",userScheme));

export default UserModel;