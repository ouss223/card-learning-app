import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  try {
    if (!userId) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    const user = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id FROM users WHERE id = ?',
        [userId],
        (err, result) => err ? reject(err) : resolve(result[0])
      );
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

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
      db.query(`
        SELECT 
          w.id,
          w.word,
          w.translated_word,
          COALESCE(up.is_learned, FALSE) as is_learned
        FROM words w
        LEFT JOIN user_progress up 
          ON w.id = up.word_id 
          AND up.user_id = ?
        WHERE w.card_id = ?
      `, [userId, id], (err, result) => err ? reject(err) : resolve(result));
    });

    const wordPairs = words.map(word => [
      word.word,          
      word.translated_word, 
      word.id,            
      Boolean(word.is_learned) 
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