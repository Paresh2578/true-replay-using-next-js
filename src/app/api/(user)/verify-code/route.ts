import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import UserModel, { User } from "@/models/user.model";

export async function POST(request : Request){
    await dbConnect();

    try{
        /**
         * 1. check expired  token or not
         * 2. verify
         * 3. update status in db
         */

        const {username,verifyCode} = await request.json();

        //  get user
        const user = await UserModel.findOne({username : username});
        if(!user){
            ApiResponseMessage({success:false , statusCode:404 ,message:"user not found"});
        }
        

        //// Check if the code is correct and not expired
        const isCodeValid = user!.verifyCode === verifyCode;
        const isCodeNotExpired = new Date(user!.verifyCodeExpiry) > new Date();

        // // Code is incorrect
        if(!isCodeValid && !isCodeNotExpired){
           return ApiResponseMessage({success:false , statusCode:400 ,message:"Incorrect verification codes"});
        }else if(!isCodeNotExpired){
            return ApiResponseMessage({success:false , statusCode:400 ,message:"'Verification code has expired. Please sign up again to get a new code."});
        }

        //  // Update the user's verification status
        user!.isVerified = true;

        await user!.save();

       return ApiResponseMessage({success:true , statusCode:400 ,message:"Account verified successfully"});
    }catch(error){
        return ApiResponseMessage({success:false , statusCode:500 ,message:"Error verifying user"});
    }
}