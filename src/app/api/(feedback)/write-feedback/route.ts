import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import handleMongooseValidationError from "@/helpers/handleMongooseValidationError";
import FeedbackModel, { Feedback } from "@/models/feedback.model";


export async function POST(request:Request){
    await dbConnect();

    try{
        const {content , star, userId , createdAt} = await request.json() as Feedback;

        const newFeedback = new FeedbackModel({
            content,
            star,
            userId,
            createdAt
        })

        // save
        await newFeedback.save();

        return ApiResponseMessage({success:true,statusCode:201,message:"Successfully Write feedback"});
    }catch(error){
       const validationResponse =  handleMongooseValidationError(error);
       if(validationResponse) return validationResponse;

        return ApiResponseMessage({success:false , statusCode:500 ,message:"Failed Write Feedback "});
    }
}