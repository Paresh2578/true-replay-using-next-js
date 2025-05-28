import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import getUserFromRequest from "@/helpers/getUserFromRequest";
import FeedbackModel from "@/models/feedback.model";

export async function GET(request:Request){
    await dbConnect();

    try{
        /**
         * 1. get userId from request
         * 2. get all feedback
         */

        //get userId from request
        const user = await getUserFromRequest();

        // 2. get All feedbacks
        const feedbacks = await FeedbackModel.find({userId:user._id}).sort({createdAt:-1})

        return ApiResponseMessage({success:true,statusCode:200,message:"Successfully Get all feedback" , data:feedbacks});
    }catch(error){
        return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Get ALL Feedback"});
    }
}