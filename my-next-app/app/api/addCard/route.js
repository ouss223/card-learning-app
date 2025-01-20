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

        // Insert the card and get the card ID
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
            for (let word_tuple of words) {
                if (typeof word_tuple[0] === 'string') {
                    const insertWordQuery = `
                        INSERT INTO words (word, card_id)
                        VALUES (?, ?)
                    `;
                    const wordResult = await new Promise((resolve, reject) => {
                        db.query(insertWordQuery, [word_tuple[0], cardId], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });

                    // Insert translated words into the `translated_words` table
                    if (typeof word_tuple[1] === 'string') {
                        const insertTranslatedWordQuery = `
                            INSERT INTO translated_words (translated_word, word_id)
                            VALUES (?, ?)
                        `;
                        await new Promise((resolve, reject) => {
                            db.query(insertTranslatedWordQuery, [word_tuple[1], wordResult.insertId], (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            });
                        });
                    }
                } else {
                    console.error("Invalid word type:", word_tuple[0]);
                }
            }
        }

        return NextResponse.json({ message: 'Card added successfully', cardData });
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json({ message: 'Error adding card', error: error.message }, { status: 500 });
    }
}
