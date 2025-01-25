import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const card = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM cards WHERE id = ?',
        [id],
        (err, result) => err ? reject(err) : resolve(result[0])
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
        'SELECT word, translated_word FROM words WHERE card_id = ?',
        [id],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });

    const wordPairs = words.map(word => [
      word.word,
      word.translated_word
    ]);

    return NextResponse.json({
      message: 'Card retrieved successfully',
      cardData: wordPairs,
      title: card.title,
      description: card.description,
      targetLanguage: card.target_language 
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch card data" },
      { status: 500 }
    );
  }
}