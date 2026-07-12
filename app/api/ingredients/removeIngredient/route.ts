import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const sql = neon(process.env.DATABASE_URL ?? '');
        
        await sql`DELETE FROM ingredients WHERE id = ${body.id}`;
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove ingredient" }, { status: 500 });
    }
}