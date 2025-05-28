import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import ApiResponseMessage from './app/types/apiResponseMessage';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*','/', '/sign-in', '/sign-up', '/verify/:path*'],
};

const protectedApiRoutes = [
    "api/getAllFeedbacks",
    "api/deleteFeedback",
];

export async function middleware(request: NextRequest){
    const token = await getToken({req : request});
    const url = request.nextUrl;

     // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if(token && 
        (url.pathname.startsWith("/sign-in")) || 
        (url.pathname.startsWith("/sign-up")) ||
        (url.pathname.startsWith("/verify")) ||
        (url.pathname.startsWith("/"))
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // user try to access protected router when user not login 
    // then go to login page for fortend access
    if(!token && (url.pathname.startsWith("/dashboard"))){
        return NextResponse.redirect(new URL('/sign-in',request.url));
    }

    // then auAuthorize response when hit protected api without login
    if(!token && protectedApiRoutes.includes(url.pathname)){
        return ApiResponseMessage({success:false,message : "unauthorized",statusCode:401})
    }

    return NextResponse.next();
}