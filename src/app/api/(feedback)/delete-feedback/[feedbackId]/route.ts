import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import FeedbackModel from "@/models/feedback.model";

export async function DELETE(request : Request , {prams} : {prams : {feedbackId : string}}){
    await dbConnect();

    try{
        const feedbackId = prams.feedbackId;
        const feedbackDelete = await FeedbackModel.findByIdAndDelete(feedbackId);

        if(!feedbackDelete){
            return ApiResponseMessage({success:false , statusCode:404 ,message:"Feedback not found"});
        }
        
        return ApiResponseMessage({success:true,statusCode:201,message:"Successfully deleted feedback"});
    }catch(error){
         return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Delete Feedback"});
    }
}