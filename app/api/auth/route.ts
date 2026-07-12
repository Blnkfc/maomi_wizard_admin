import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { login, password } = await req.json();

    if (
        login !== process.env.ADMIN_LOGIN ||
        password !== process.env.ADMIN_PASSWORD
    ) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", "authenticated", {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
}
