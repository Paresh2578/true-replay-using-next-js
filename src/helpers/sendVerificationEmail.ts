import VerificationEmail from "../../email/VerificationEmail";
import { Resend } from "resend";
import ApiResponseMessage from "../app/types/apiResponseMessage";

const resend = new Resend(process.env.RESEND_API_KEY);

interface sendVerificationEmailPrams {
    email : string,
    username:string,
    verifyCode :string
}

export default async function sendVerificationEmail({email , username  , verifyCode}:sendVerificationEmailPrams){
    try{
        const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'True Feedback Message Verification Code',
        react: VerificationEmail({username ,otp:verifyCode }),
    });

    if(error){
        return ApiResponseMessage({message : "Failed to send verification code",statusCode:500 , success:false});
    }
    }catch(error){
        return ApiResponseMessage({message : "Failed to send verification code",statusCode:500 , success:false});
    }
}