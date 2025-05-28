import mongoose , {Schema,Document} from "mongoose";

export interface Feedback {
    _id ?: string;
    content : string;
    star? : number,
    userId : string;
    createdAt? : Date
}

const FeedbackSchema : Schema<Feedback> = new Schema({
    content : {
        type : String,
        required : [true, "Content is required"],
        trim:true
    },
    star : {
        type : Number,
        enum : [1,2,3,4,5]
    },
    userId : {
      type:String,
      required : [true,"userId is required"],
      trim:true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        trim : true
    }
})

const FeedbackModel = (mongoose.models.Feedback as mongoose.Model<Feedback>) || (mongoose.model<Feedback>("Feedback",FeedbackSchema));

export default FeedbackModel;