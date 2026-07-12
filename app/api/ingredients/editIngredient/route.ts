import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const sql = neon(process.env.DATABASE_URL ?? '');
        
        const data = await sql`
            UPDATE ingredients
            SET name = ${body.name}, lactose = ${body.lactose}, sweetness = ${body.sweetness}, sourness = ${body.sourness}, bitterness = ${body.bitterness}, saltiness = ${body.saltiness}, compatible_with = ${body.compatible_with}, available_temperatures = ${body.available_temperatures}
            WHERE id = ${body.id}
            RETURNING *;
        `;
        
        return NextResponse.json(data[0]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update ingredient" }, { status: 500 });
    }
}