import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import ApiResponseMessage from './app/types/apiResponseMessage';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*','/', '/sign-in', '/sign-up', '/verify/:path*',"/api/get-all-feedback"],
};

const protectedApiRoutes = [
    "/api/get-all-feedback",
    "/api/delete-feedback/:path*",
    "api/accept-messages",
    "verify-code"
];

export async function middleware(request: NextRequest){
    const token = await getToken({req : request});
    const url = request.nextUrl;
    const path = url.pathname;

     // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if(token && !protectedApiRoutes.includes(url.pathname) &&
         ["/", "/sign-in", "/sign-up","/verify"].includes(path)
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // user try to access protected router when user not login 
    // then go to login page for fortend access
    if(!token && (path.startsWith("/dashboard"))){
        return NextResponse.redirect(new URL('/sign-in',request.url));
    }

    // then auAuthorize response when hit protected api without login
    if(!token && protectedApiRoutes.includes(url.pathname)){
        return ApiResponseMessage({success:false,message : "unauthorized",statusCode:401})
    }

    return NextResponse.next();
}