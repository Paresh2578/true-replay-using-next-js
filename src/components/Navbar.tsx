"use client"

import React from 'react'
import { Button } from './ui/button'
import { User } from 'next-auth';
import { useSession , signOut} from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const {data : session} = useSession();
  const user : User = session?.user;

  return (
    <nav className='min-h-[9vh] flex justify-center p-2 items-center w-[100wv]'>
      <div className='bg-card p-4 ps-4 pe-4 shadow-2xl  items-center w-full  rounded-2xl'>
        <div className=" flex justify-between items-center">
          <p className='text-gray-900 font-bold text-2xl'>True Feedback</p>

          {
            user && <p className='text-gray-900'>Welcome, paresh</p>
          }
          
          {
            user ? 
            <Button onClick={()=> signOut()} className='text-slate-50 bg-gray-900 cursor-pointer'>Log Out</Button>
            :
            <Link href="/sign-in">
             <Button className='cursor-pointer'>Log In</Button> 
            </Link>
          }
        </div>
    </div>
    </nav>
  )
}
