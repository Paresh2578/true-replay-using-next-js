"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { ApiResponseMessage } from '@/app/types/apiResponseMessage';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

export default function SignIn() {
    const [submitLoading,setSubmitLoading] = useState<boolean>(false);
     const router = useRouter();
  
  
      const { register, handleSubmit , formState :{errors} } = useForm<z.infer<typeof signInSchema>>({
         resolver: zodResolver(signInSchema),
        defaultValues :{
          email: '',
          password: '',
        }
      });

  
      const onSubmit = async (data : z.infer<typeof signInSchema>)=>{
        setSubmitLoading(true);
        try{
          const res = await signIn("credentials",{
            redirect:false,
             identifier: data.email,
            password: data.password,
          })

          if(res?.error){
            if(res.error === "CredentialsSignin" ){
              toast.error("Incorrect username or password");
            }else{
              toast.error(res.error);
            }
          }
          router.replace(`/dashboard`);
        }catch(error){
          toast.error("Failed to sign in try again");
        }finally{
          setSubmitLoading(false);
        }
      }

  return (
    <div className='min-h-[90vh] w-full bg-gray-900 flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-[450px]'>
        <Card className="m-3">
      <CardHeader>
        <CardTitle className='text-3xl font-bold text-center'> Welcome Back to True Feedback </CardTitle>
        <CardDescription className='text-center text-black text-1xl'>Sign in to continue your secret conversations.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">

            {/* email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input {...register("email")} type='email' id="email" placeholder="Enter your email"   />
              {errors.email && <Label className='text-red-500'>{errors.email.message}</Label>}
            </div>

            {/* password */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">password</Label>
              <Input {...register("password")} type='password' id="password" placeholder="Enter your password" />
              {errors.password && <Label className='text-red-500'>{errors.password.message}</Label>}
            </div>
          </div>
      </CardContent>
      <CardFooter className="w-full flex-col gap-3">
        <Button className='w-full'  disabled={submitLoading}>{submitLoading ? <Loader2 className="animate-spin"/> :  "Sign In"}</Button>

        <div className='flex gap-1'>
          <p> Not a member yet? </p>
          <Link href="sign-up" className='text-blue-500 underline'>Sign up</Link>
        </div>
      </CardFooter>
      </Card>
      </form>
       
    </div>
  )
}
