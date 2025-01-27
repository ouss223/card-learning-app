import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
//add auth to this later not needed for now as i dont use the api itself
export async function GET(request, { params }) {
  const { id: cardId } = params;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  try {
    const [user] = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id FROM users WHERE email = ?',
        [email],
        (err, result) => err ? reject(err) : resolve(result)
      );
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const words = await new Promise((resolve, reject) => {
      db.query(`
        SELECT w.id, w.word, w.translated_word,
               COALESCE(up.is_learned, FALSE) AS is_learned
        FROM words w
        LEFT JOIN user_progress up 
          ON w.id = up.word_id AND up.user_id = ?
        WHERE w.card_id = ?
      `, [user.id, cardId], (err, result) => 
        err ? reject(err) : resolve(result)
      );
    });

    return NextResponse.json({
      message: 'Progress retrieved successfully',
      progress: words.map(word => ({
        word_id: word.id,
        original: word.word,
        translation: word.translated_word,
        is_learned: Boolean(word.is_learned)
      }))
    });

  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load progress" },
      { status: 500 }
    );
  }
}