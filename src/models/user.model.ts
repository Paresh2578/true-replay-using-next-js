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
        unique : true,
        match:[/[A-Za-z0-9_]+$/ , 'Username must not contain special characters'],
        minlength : [2,'Username must be at least 2 characters'],
        maxlength : [20, 'Username must be no more than 20 characters']
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

const UserModel = (mongoose.models.user as mongoose.Model<User>) || (mongoose.model("User",userScheme));

export default UserModel;