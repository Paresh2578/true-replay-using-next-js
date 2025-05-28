"use client"
import React, { useEffect, useState } from 'react'

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession} from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import type { Feedback } from '@/models/feedback.model';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { ApiResponseMessage } from '@/app/types/apiResponseMessage';
import FeedbackCard from '@/components/FeedbackCard';

export default function Dashboard() {
  const {data : session, status } = useSession();
   const user : User = session?.user;
   const baseUrl = `${window.location.protocol}//${window.location.host}`;
   const profileUrl =  `${baseUrl}/u/${user?._id}/${user?.username}`;

   const [loading,setLoading] = useState<boolean>();
   const [feedbacks , setFeedbacks] = useState<Feedback[]>();
   const [acceptMessage,setAcceptMessage] = useState<boolean>();
   const [firstTime , setFirstTime] = useState<boolean>(true);


      const chnageStatus = async (checked: boolean) => {
    try {
      // Optionally update local state first
      setAcceptMessage(checked);

      // Send update to server
      const res = await axios.put("/api/accept-messages");
      console.log("Updated:", res.data);
    } catch (error) {
      console.error("Failed to update status");
    }
  };
   


   useEffect(() => {
      if (user?._id) {
        fetchFeedbacks();
        getAcceeptMessageStatus();
      }
    }, [user?._id]);


   const fetchFeedbacks = async ()=>{
         setLoading(true);
            try{
              const res = await axios.get("/api/get-all-feedback");
              toast.success(res.data.message);
              setFeedbacks(res.data.data);
            }catch(error){
              const axiosError = error as AxiosError<ApiResponseMessage>;
            toast.error(axiosError.response?.data.message || "Failed to write feedback try again");
            }finally{
              setLoading(false);
            }
   }

   const getAcceeptMessageStatus = async ()=>{
         try{
          console.log(user);
              const res = await axios.get(`/api/get-acceept-message-status/${user?._id}`);
              console.log(res.data);
              setAcceptMessage(res.data.data);
            }catch(error){
              // getAcceeptMessageStatus();
            }
   }


    const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast('Profile URL has been copied to clipboard.');
   };



  return (
    <div className='text-white container w-full flex pt-10 justify-center '>
    <div className='w-[90vw] md:w-[80vw] text-center space-y-10'>
      <p className='text-4xl md:text-4xl font-medium text-start'>User Dashboard</p>

      <div className='bg-white text-black p-4 rounded-md mt-6 space-y-1'>
        <p className='font-bold text-start font-sans'>Copy Your Unique Link</p>
        
        <div className='flex items-center justify-between gap-4 '>
          <p className='break-all bg-gray-200 p-2 rounded-sm w-full text-start'>{profileUrl}</p>
          <Button onClick={()=> copyToClipboard()} className='text-slate-50 bg-gray-900 cursor-pointer'>Copy</Button>
        </div>

        <div className='flex items-center gap-2 mt-4'>
          <Switch id="airplane-mode" checked={acceptMessage}
        onCheckedChange={chnageStatus}/>
          <Label htmlFor="airplane-mode">Accept Messages : {acceptMessage ? "On" : "Off"} </Label>
        </div>
      </div>

      <div className='bg-white text-black p-4 rounded-md mt-6 space-y-1'>
        <div className='items-start w-full flex '>
          <Button className='hover:cursor-pointer' onClick={()=> fetchFeedbacks()}><RefreshCcw/></Button>
        </div>

        <div className='mt-3 grid-cols-1 md:grid-cols-2 grid gap-4'>
           {
            (feedbacks && !loading) ? feedbacks.map((feedback : Feedback)=>{
              return <div key={feedback._id}>
                 <FeedbackCard feedback={feedback}/>
              </div>
            }) : <div><Loader2 className="animate-spin"/></div>
           }
        </div>
      </div>
    </div>
</div>

  )
}
