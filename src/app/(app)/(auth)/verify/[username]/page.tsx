"use client"

import React, { useEffect, useState } from 'react'
import { useForm , Controller } from 'react-hook-form';
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
import { useParams, useRouter } from 'next/navigation';
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema';

export default function Verify() {
  const {username} = useParams<{ username: string }>();
  const router = useRouter();

  
  const [submitLoading,setSubmitLoading] = useState<boolean>(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<z.infer<typeof verifyCodeSchema>>({
         resolver: zodResolver(verifyCodeSchema),
      });

  const onSubmit = async(data : z.infer<typeof verifyCodeSchema>)=>{
    setSubmitLoading(true);

    try{
      const res = await axios.post("/api/verify-code",{username ,verifyCode : data.verifyCode});

      toast.success(res.data.message);

      router.replace("/dashboard");
    }catch(error){
      const axiosError = error as AxiosError<ApiResponseMessage>;
      toast.error(axiosError.response?.data.message || "Failed to verification try again");
    }finally{
      setSubmitLoading(false);
    }
  }
  return (
    <div className='min-h-[90vh] w-full  flex justify-center items-center'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-[450px]'>
        <Card className="m-3">
            <CardHeader>
              <CardTitle className='text-3xl font-bold text-center'> Verify Your Account </CardTitle>
              <CardDescription className='text-center text-black text-1xl'>Enter the verification code sent to your email.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center justify-center gap-4">
                    <Controller
                        control={control}
                        name="verifyCode"
                        render={({ field }) => (
                          <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        )}
                      />
                      {errors.verifyCode && <Label className='text-red-500'>{errors.verifyCode.message}</Label>}
                </div>

            </CardContent>
            <CardFooter className="w-full flex-col gap-3">
              <Button className='w-full' disabled={submitLoading}>{submitLoading ? <Loader2 className="animate-spin"/> :  "Verify"}</Button>

              <div className='flex gap-1'>
                <p> Not a member yet? </p>
                <Link href="/sign-up" className='text-blue-500 underline'>Sign up</Link>
              </div>
            </CardFooter>
        </Card>
      </form>
       
    </div>
  )
}
