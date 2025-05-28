import dbConnect from "@/helpers/dbConnect";
import ApiResponseMessage from "@/app/types/apiResponseMessage";
import UserModel from "@/models/user.model";

export async function GET(request:Request , { params }: { params: { userId: string } }){
    await dbConnect();

    try{
        //find user
        const user = await UserModel.findOne({_id : params?.userId});

        if(!user){
            return ApiResponseMessage({success:false , statusCode:404 ,message:"User Not Found"});
        }
        console.log(user);
        return ApiResponseMessage({success : true , statusCode:200 , message : "Successfully get AcceptingMessages status",data:user.isAcceptingMessages});
    }catch(error){
        console.log(error);
        return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Get Accept Message Status"});
    }
}