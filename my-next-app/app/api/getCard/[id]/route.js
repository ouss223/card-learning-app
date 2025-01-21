import { title } from 'process';
import db from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const card = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM cards WHERE id = ?',
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result[0]); 
        }
      );
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    const words = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM words WHERE card_id = ?',
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    const wordPairs = [];
    
    for (const word of words) {
      const translations = await new Promise((resolve, reject) => {
        db.query(
          'SELECT translated_word FROM translated_words WHERE word_id = ?',
          [word.id],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      translations.forEach(translation => {
        wordPairs.push([word.word, translation.translated_word]);
      });
    }

    return NextResponse.json({
      message: 'Card retrieved successfully',
      cardData: wordPairs ,
      title: card.title,
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch card data" },
      { status: 500 }
    );
  }
}