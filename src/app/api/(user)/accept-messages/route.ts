import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import getUserFromRequest from "@/helpers/getUserFromRequest";
import UserModel from "@/models/user.model";

export async function PUT(request : Request){
    await dbConnect();

    try{
        /**
         * 1. get userId 
         * 2. update
         */

        const sessionUser =  await getUserFromRequest();

        //find user
        const user = await UserModel.findOne({_id : sessionUser._id});

        if(!user){
            return ApiResponseMessage({success:false , statusCode:404 ,message:"User Not Found"});
        }

        // update
        user.isAcceptingMessages = !user.isAcceptingMessages;
        await user.save();
        return ApiResponseMessage({success : true , statusCode:200 , message : "Successfully isAcceptingMessages update"});
    }catch(error){
       return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Accept Message"});
    }
}