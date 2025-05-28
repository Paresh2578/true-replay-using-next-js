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

        const user =  await getUserFromRequest();

        const userUpdate = await UserModel.updateOne(
            {_id : user._id},
            {$set : {isAcceptingMessages : !user.isAcceptingMessages}}
        )

        if(userUpdate.upsertedCount == 0){
            return ApiResponseMessage({success : false , statusCode:404 , message : "user not found"});
        }

        return ApiResponseMessage({success : true , statusCode:200 , message : "Successfully isAcceptingMessages update"});
    }catch(error){
       return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Accept Message"});
    }
}