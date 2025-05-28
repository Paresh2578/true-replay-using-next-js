import ApiResponseMessage from "@/app/types/apiResponseMessage";
import dbConnect from "@/helpers/dbConnect";
import genrateOTP from "@/helpers/genrateOTP";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import UserModel, { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { TruckElectricIcon } from "lucide-react";

export async  function POST(request : Request) : Promise<any>{
   await dbConnect();
    try{
        /**
         * 1. check uniqe username existingVerifiedUserByUsername
         * 2. check by email and verify
         * 3. save
         * 4. send mail
         */
        const {username , email , password} = await request.json();

        let existingVerifiedUserByUsername = await UserModel.findOne({username : username});

        if(existingVerifiedUserByUsername){
            return ApiResponseMessage({message : "username alredy used",success:false , statusCode:400});
        }

        const existingUserByEmail  =  await UserModel.findOne({email : email});
        const verifyCode = genrateOTP(6);

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return ApiResponseMessage({message : "'User already exists with this email", statusCode : 400 ,success:false })
            }

            // update database
            const hashedPassword : string = await bcrypt.hash(password,10) as string;
            const expiryDate= new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCodeExpiry = expiryDate;
            existingUserByEmail.verifyCode=  verifyCode;

            await existingUserByEmail.save();

        }else{
            // add new user
            const hashedPassword : string = await bcrypt.hash(password,10) as string;
            const expiryDate= new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            let newUser = new UserModel<User>({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                isVerified: false,
                isAcceptingMessages: true,
                verifyCodeExpiry : expiryDate
            });

            await newUser.save();
        }

        //send verification code
       const sendEmail =  await sendVerificationEmail({email , username , verifyCode});
       if(sendEmail) return sendEmail;

        return ApiResponseMessage({statusCode:201 , success:true , message:"successfully sign"});

    }catch(error){
        console.log(error);
        return ApiResponseMessage({message : "failed to sign up",success : false , statusCode:500})
    }
}   
