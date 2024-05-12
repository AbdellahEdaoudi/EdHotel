// Import statements should be separate
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Export statement should come after the code block
export default withAuth(async function middleware(request: NextRequest){
  const pathname = request.nextUrl.pathname;
  const isAuth= await getToken({req:request})
  const protectedRoutes = ['/HomePage'];
  const isAuthRoute = pathname.startsWith('/Login');
  const isProtectedRoute = protectedRoutes.some((route) =>
     pathname.startsWith(route)
   );

  if (!isAuth && isProtectedRoute) {
    return NextResponse.redirect(new URL('/Login', request.url));
  }
  if (!isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL('/HomePage', request.url));
  }
  
},{
    callbacks:{
        async authorized() {
            return true;
          }
    }
});


export const config = {
    matcher: ["//:path*",'/Login/:path*'],
  };
  
