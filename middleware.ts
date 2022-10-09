import { NextResponse } from "next/server";
import * as jose from "jose";
import type { NextRequest } from "next/server";
import { getBaseUrl } from "./utils/trpc";
const PUBLIC_FILE = /\.(.*)$/;

const publicRoutes = ["/", "/login"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (
      pathname.startsWith("/_next") || // exclude Next.js internals
      pathname.startsWith("/api") || //  exclude all API routes
      pathname.startsWith("/static") || // exclude static files
      PUBLIC_FILE.test(pathname) ||
      publicRoutes.includes(pathname)
      // exclude all files in the public folder
    )
      return NextResponse.next();

    const userToken = request.cookies.get("user-token");

    const { payload } = await jose.jwtVerify(
      userToken!,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    console.log({ payload });
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(getBaseUrl() + "/login");
  }
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/:path",
// };
