import { Feedback } from '@/models/feedback.model'
import React from 'react'
import dayjs from 'dayjs';
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@react-email/components'
import { X } from 'lucide-react';



export default function FeedbackCard({feedback} : { feedback :  Feedback}) {
  return (
    <Card className='shadow hover:scale-103 transition-transform duration-200 hover:cursor-pointer'>
        <CardHeader>
          <div className='flex justify-between'>
            <CardTitle>{feedback.content}</CardTitle>
           <Button className='bg-red-500 p-6 rounded-sm '>
                <X className="w-5 h-5 m-1 text-white"/>
           </Button>
          </div>
           
        <div className="text-sm">
          {dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
        </CardHeader>
      
    <CardHeader>
      <p></p>
    </CardHeader>
  </Card>
  )
}
