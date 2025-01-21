import { NextResponse } from 'next/server';
import db from '../../../lib/db';


export async function GET(request) {

    try {
        const getCardsQuery = `
            SELECT * FROM cards
        `;

        const cards = await new Promise((resolve, reject) => {
            db.query(getCardsQuery, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return NextResponse.json(cards);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
}
