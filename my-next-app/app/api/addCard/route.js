import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(request) {
    try {
        const { title, targetLanguage, description, words } = await request.json();
        const userId = 1;
        console.log(userId, title, targetLanguage, description, words);

        const cardData = {
            title,
            targetLanguage,
            description,
            words,
        };

        const insertCardQuery = `
            INSERT INTO cards (title, target_language, description, user_id)
            VALUES (?, ?, ?, ?)
        `;
        console.log("here comes");

        // Insert the card and get the card ID using Promises
        const cardResult = await new Promise((resolve, reject) => {
            db.query(insertCardQuery, [title, targetLanguage, description, userId], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        console.log("card done");
        const cardId = cardResult.insertId;
        console.log("card ID: ", cardId);

        // Ensure 'words' is an array of strings and insert them one by one
        if (Array.isArray(words)) {
            for (let word of words) {
                if (typeof word === 'string') {
                    const insertWordQuery = `
                        INSERT INTO words (word, card_id)
                        VALUES (?, ?)
                    `;
                    await new Promise((resolve, reject) => {
                        db.query(insertWordQuery, [word, cardId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });
                } else {
                    console.error("Invalid word type:", word);
                }
            }
        }

        return NextResponse.json({ message: 'Card added successfully', cardData });
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ message: 'Error adding card', error: error.message }, { status: 500 });
    }
}
