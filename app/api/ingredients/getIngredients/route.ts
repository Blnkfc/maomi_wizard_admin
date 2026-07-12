import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
    const sql = neon(process.env.DATABASE_URL ?? '');
    const data = await sql`SELECT * FROM ingredients;`;
    return NextResponse.json(data);
}