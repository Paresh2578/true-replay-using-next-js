
import React from 'react'

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

export default function SignIn() {
  return (
    <div className='min-h-[90vh] w-full bg-gray-900 flex justify-center items-center'>
       <Card className="w-[450px]">
      <CardHeader>
        <CardTitle className='text-3xl font-bold text-center'> Welcome Back to True Feedback </CardTitle>
        <CardDescription className='text-center text-black text-1xl'>Sign in to continue your secret conversations.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">

            {/* email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">email</Label>
              <Input type='email' id="email" placeholder="Enter your email" />
            </div>

            {/* password */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">password</Label>
              <Input type='password' id="password" placeholder="Enter your poject" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="w-full flex-col gap-3">
        <Button className='w-full'>Sign In</Button>

        <div className='flex gap-1'>
          <p> Not a member yet? </p>
          <Link href="sign-up" className='text-blue-500 underline'>Sign up</Link>
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
