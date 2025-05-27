import mongoose , {Mongoose, Schema,Document} from "mongoose";

export interface Message {
    _id ?: string;
    content : string;
    userId : string;
    createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String,
        required : [true, "Content is required"],
        trim:true
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

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>("Message",MessageSchema));

export default MessageModel;