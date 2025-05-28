import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import UserModel from "@/models/user.model";
import { usernameQuerySchema } from "@/schemas/usernameQuerySchema";

export async function GET(request:Request){
    await dbConnect();

    try{
        const {searchParams} =new URL(request.url);
        const queryParams = {
            username : searchParams.get("username")
        }

        const result = usernameQuerySchema.safeParse(queryParams);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            const errorMsg = usernameErrors.length > 0 ? usernameErrors.join(",") : 'Invalid query parameters';

            return ApiResponseMessage({success:false,statusCode:400,message:errorMsg});
        }

        const user = await UserModel.findOne({username : queryParams.username});

        if(user){
            return ApiResponseMessage({success:false,statusCode:200,message:"Username is already taken",data:false});
        }

         return ApiResponseMessage({success:true,statusCode:200,message:"username is quique",data:true});
    }catch(error){
        return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Check unique username"});
    }
}