import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
    const isAuthenticated = req.cookies.get("admin_session")?.value === "authenticated";
    const isLoginPage = req.nextUrl.pathname === "/login";

    if (!isAuthenticated && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
