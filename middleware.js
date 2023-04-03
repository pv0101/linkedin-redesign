// needed to move this file to root. tutorial used beta version so everything is a little different

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  if (pathname === '/') {
    const session = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      secureCookie: process.env.NODE_ENV === 'production',
    });
    if (!session) return NextResponse.redirect(`${origin}/home`);
  }
}

// export async function middleware(req) {
//   if (req.nextUrl.pathname === "/") {//if user tries to access protected route
//     const session = await getToken({
//       req,
//       secret: process.env.JWT_SECRET,
//       secureCookie: process.env.NODE_ENV === "production",
//     });
//     // You could also check for any property on the session object,
//     // like role === "admin" or name === "John Doe", etc.

    

//     if (!session) {
//     const url = req.nextUrl.clone();//needed these lines to redirect correctly. non beta version of middleware does not take relative url
//     url.pathname = '/home';
//     return NextResponse.rewrite(url);//if session does not exist redirect to /home page
//     // If user is authenticated, continue.
//     }
//   }
// }