"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema } from '@/schemas/feedbackSchema';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { use, useState } from "react";
import { ApiResponseMessage } from "@/app/types/apiResponseMessage";
import axios, { AxiosError } from "axios";

interface FeedbackWriteProps {
  params: Promise<{
    username: string;
    userId: string;
  }>;
}



export default function FeedbackWrite({params} : FeedbackWriteProps) {
   const { username, userId } = use(params);

  const [loading,setLoading] = useState<boolean>(false);
  const [submitDisabled , setSubmitDisabled] = useState<boolean>(true);

  const { register, handleSubmit,reset  , formState :{errors} } = useForm<z.infer<typeof feedbackSchema>>({
           resolver: zodResolver(feedbackSchema),
          defaultValues :{
            message : ""
          }
        });

   const onSubmit = async (data : z.infer<typeof feedbackSchema>)=>{
        setLoading(true);
        setSubmitDisabled(true);
        try{
          const res = await axios.post("/api/write-feedback" , {content : data.message , userId : userId});
          toast.success(res.data.message);
        }catch(error){
          const axiosError = error as AxiosError<ApiResponseMessage>;
        toast.error(axiosError.response?.data.message || "Failed to write feedback try again");
        }finally{
          setLoading(false);
          reset();
        }
      }
  return (
    <div className='bg-white w-full h-screen flex justify-center pt-[8vh]'>
      <div className='w-[90vw] md:w-[50vw]'>
        <p className='text-3xl font-bold mb-4 text-center'>Public Profile Link</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="feedback">Send Anonymous Feedback to @{username}</Label>
              <Textarea {...register("message")} id="feedback" onChange={(e)=>setSubmitDisabled(e.target.value.toString().trim() == "")} placeholder="Write your anonymous message here" />
              {errors.message && <Label className='text-red-500'>{errors.message.message}</Label>}
            </div>
            
            <div className='flex justify-center'>
              <Button type='submit' disabled={loading ||  submitDisabled}>{loading ? <Loader2 className="animate-spin"/> :  "Send it"}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
