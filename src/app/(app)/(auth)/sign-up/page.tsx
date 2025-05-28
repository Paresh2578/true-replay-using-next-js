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
import { signUpSchema } from '@/schemas/signUpSchema';
import useDebounce from '@/hooks/useDebounce';
import { ApiResponseMessage } from '@/app/types/apiResponseMessage';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [uniqueUserNameLoading,setUniqueUserNameLoading] = useState<boolean>(false);
  const [isUniqueUserNameError,setIsUniqueUserNameError] = useState<boolean>(false);
  const [usernameMessage, setUsernameMessage] = useState<string>();
  const [username, setUsername] = useState('');

  const [submitLoading,setSubmitLoading] = useState<boolean>(false);

  const debouncedUsername = useDebounce({text:username ,duration:300})
   const router = useRouter();


    const { register, handleSubmit , formState :{errors} } = useForm<z.infer<typeof signUpSchema>>({
       resolver: zodResolver(signUpSchema),
      defaultValues :{
         username: '',
        email: '',
        password: '',
      }
    });

   

    useEffect(() => {
      if (debouncedUsername) {
         const checkUsernameUnique = async()=>{
          setUniqueUserNameLoading(true);
          setIsUniqueUserNameError(false);
          setUsernameMessage("");

          try{
            const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
            const res = response.data as ApiResponseMessage;

            setUsernameMessage(res.message);
            setIsUniqueUserNameError(!res.data);
          }catch(error){
            const axiosError = error as AxiosError<ApiResponseMessage>;
            setIsUniqueUserNameError(true);
            setUsernameMessage(axiosError.response?.data.message || "something wrong");
          }finally{
            setUniqueUserNameLoading(false);
          }
         }
         checkUsernameUnique();
      }
    }, [debouncedUsername]);

    const onSubmit = async (data : z.infer<typeof signUpSchema>)=>{
      if(uniqueUserNameLoading || usernameMessage == null || usernameMessage.trim() == "") return;
      setSubmitLoading(true);
      try{
        const res = await axios.post("/api/sign-up",data);

        toast.success(res.data.message);
        router.replace(`/verify/${data.username}`);
      }catch(error){
        const axiosError = error as AxiosError<ApiResponseMessage>;
        toast.error(axiosError.response?.data.message || "Failed to sign try again");
      }finally{
        setSubmitLoading(false);
      }
    }


  return (
     <div className='min-h-[90vh] w-full  flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-[450px]'>
        <Card className="m-3">
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-center'>Join True Feedback </CardTitle>
              <CardDescription className='text-center text-black text-1xl'>Sign up to start your anonymous adventure.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">

                  {/* username */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input {...register("username")} id="username" placeholder="Enter your name" onChange={(e)=> setUsername(e.target.value)} />
                    {errors.username && !uniqueUserNameLoading && !usernameMessage   && <Label className='text-red-500'>{errors.username.message}</Label>}
                    {usernameMessage && !uniqueUserNameLoading && <Label className={isUniqueUserNameError ? "text-red-500":"text-green-500" }>{usernameMessage}</Label>}
                    {uniqueUserNameLoading &&  <Loader2 className="animate-spin" />}
                  </div>

                  {/* email */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input {...register("email")} type='email' id="email" placeholder="Enter your email"   />
                    {errors.email && <Label className='text-red-500'>{errors.email.message}</Label>}
                  </div>

                  {/* password */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input {...register("password")} type='password' id="password" placeholder="Enter your password" />
                    {errors.password && <Label className='text-red-500'>{errors.password.message}</Label>}
                  </div>
                </div>
            </CardContent>
            <CardFooter className="w-full flex-col gap-3">
              <Button className='w-full' disabled={submitLoading}>{submitLoading ? <Loader2 className="animate-spin"/> :  "Sign Up"}</Button>

              <div className='flex gap-1'>
                <p>Alredy a member?</p>
                <Link href="sign-in" className='text-blue-500 underline'>Sign in</Link>
              </div>
            </CardFooter>
        </Card>
      </form>
       
    </div>
  )
}
