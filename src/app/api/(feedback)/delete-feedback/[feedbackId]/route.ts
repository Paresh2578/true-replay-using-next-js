import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import FeedbackModel from "@/models/feedback.model";

export async function DELETE(request : Request , {params} : {params : {feedbackId : string}}){
    await dbConnect();

    try{
        const feedbackId = params.feedbackId;

        const feedbackDelete = await FeedbackModel.findByIdAndDelete(feedbackId);

        if(!feedbackDelete){
            return ApiResponseMessage({success:false , statusCode:404 ,message:"Feedback not found"});
        }
        
        return ApiResponseMessage({success:true,statusCode:200,message:"Successfully deleted feedback"});
    }catch(error){
        console.log(error);
         return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed to Delete Feedback"});
    }
}