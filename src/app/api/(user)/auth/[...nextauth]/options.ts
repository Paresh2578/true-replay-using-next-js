import dbConnect from "@/helpers/dbConnect";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel, { User } from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
   providers :[
     CredentialsProvider({
        id: 'credentials',
        name: 'Credentials',
        credentials :{
             email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
        },
      async authorize(credentials:any) : Promise<any>{
        await dbConnect();

        try{
            /**
             * 1. check email is exits or not
             *  2. check account verify or not
             *  3. pasword verify
             *  4. login successfully
             */

            //1. check email is exits or not
            const user = await UserModel.findOne<User>({email : credentials.identifier});

            if(!user){
                throw new Error('No user found with this email');
            }

            //2. check account verify or not
            if(!user.isVerified){
                throw new Error("Please verify your account before logging in");
            }

            // 3. pasword verify
            const isPasswordCorrect = await bcrypt.compare(
                 credentials.password,
                 user.password
            );

            if(!isPasswordCorrect){
                throw new Error('Incorrect password');
            }

            // 4. login successfully
            return user;
        }catch(error : any){
            throw Error(error);
        }
       },

     })
   ],
   callbacks:{
    async jwt({token,user}){
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;
        }
        return token;
    },
    async session({session , token}){
         if(token){
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
            session.user.username = token.username;
         }
        return session;
    }
   },
   session :{
    strategy: 'jwt',
   },
   secret: process.env.NEXTAUTH_SECRET,
    pages: {
    signIn: '/sign-in',
  },
}