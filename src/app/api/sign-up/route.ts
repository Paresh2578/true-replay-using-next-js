import dbConnect from "@/helpers/dbConnect";
import genrateOTP from "@/helpers/genrateOTP";
import ResponseMessage from "@/helpers/responseMessage";
import UserModel, { User } from "@/models/user.model";
import bcrypt from "bcryptjs";

export async  function POST(request : Request) : Promise<any>{
   await dbConnect();
    try{
        /**
         * 1. check uniqe username existingVerifiedUserByUsername
         * 2. check by email and verify
         * 3. save
         */
        const {username , email , password} = await request.json();

        let existingVerifiedUserByUsername = await UserModel.findOne({username : username});

        if(existingVerifiedUserByUsername){
            return ResponseMessage({message : "username alredy used",success:false , statusCode:400});
        }

        const existingUserByEmail : User = await UserModel.findOne({email : email}) as User;
        const verifyCode = genrateOTP(6);

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return ResponseMessage({message : "'User already exists with this email", statusCode : 400 ,success:false })
            }

            // update database
            const hashedPassword : string = await bcrypt.hash(password,10) as string;
            const expiryDate= new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            existingUserByEmail.password = hashedPassword,
            // existingUserByEmail.verifyCodeExpiry = existingUserByEmail,

        }else{
            // add new user
            const hashedPassword : string = await bcrypt.hash(password,10) as string;
            const expiryDate= new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            let newUser = new UserModel<User>({
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: genrateOTP(5),
                isVerified: false,
                isAcceptingMessages: true,
                verifyCodeExpiry : expiryDate
            });

            await newUser.save();

            //send OTP
        }
    }catch(error){
        return ResponseMessage({message : "failed to sign up",success : false , statusCode:500})
    }
}   
