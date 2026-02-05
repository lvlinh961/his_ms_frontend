import { NextResponse, NextRequest } from "next/server";

const authPaths = ["/login", "/register"];
const productEditRegex = /^\/products\/\d+\/edit$/;

// Next.js 16 ưu tiên export default cho proxy
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Truy cập cookies một cách an toàn
  // Trong Next.js 16, request.cookies trả về một ReadonlyRequestCookies
  const sessionToken = request.cookies.get("sessionToken")?.value;

  // 1. Logic cho Private Paths
  // Nếu không có token và không phải trang login/register/home
  if (!sessionToken && !authPaths.some((path) => pathname.startsWith(path)) && pathname !== '/') {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Logic cho Auth Paths (Đã login thì không quay lại login)
  if (sessionToken && authPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/concultation", request.url));
  }

  // 3. Logic cho Product Edit
  if (pathname.match(productEditRegex) && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Giữ nguyên matcher cũ
export const config = {
  matcher: [
    /*
     * Match tất cả các đường dẫn ngoại trừ:
     * 1. /api (các route API)
     * 2. /_next (các file tĩnh của Next.js như static, image, v.v.)
     * 3. /_static (nếu bạn có dùng thư mục static riêng)
     * 4. Các file có đuôi mở rộng (ví dụ: favicon.ico, sitemap.xml, robots.txt)
     */
    '/((?!api|_next|.*\\..*).*)',
  ],
};