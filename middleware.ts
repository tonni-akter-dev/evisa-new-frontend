import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

export function middleware() {
// export function middleware(request: NextRequest) {
  // const token = request.cookies.get("token")?.value; // 👈 if you store token in cookies

  // If no token and trying to access `/`
  // if (!token && request.nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  return NextResponse.next();
}

// Apply middleware only to `/`
export const config = {
  matcher: ["/"],
};
