import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const sql = neon(process.env.DATABASE_URL ?? '');
        
        const data = await sql`
            INSERT INTO ingredients (name, lactose, sweetness, sourness, bitterness, saltiness, compatible_with, available_temperatures, ingredient_type)
            VALUES (${body.name}, ${body.lactose}, ${body.sweetness}, ${body.sourness}, ${body.bitterness}, ${body.saltiness}, ${body.compatible_with}, ${body.available_temperatures}, ${body.ingredient_type})
            RETURNING *;
        `;
        
        return NextResponse.json(data[0]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add ingredient" }, { status: 500 });
    }
}