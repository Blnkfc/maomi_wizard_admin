import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
    // console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);
    
    const sql = neon(process.env.DATABASE_URL ?? '');
    const data = await sql`SELECT * FROM ingredients;`;
    return NextResponse.json(data);
}