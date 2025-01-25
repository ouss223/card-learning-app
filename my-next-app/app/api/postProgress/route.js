import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function POST(request) {
  try {
    const { user_id, word_id, is_learned } = await request.json();

    await new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO user_progress 
          (user_id, word_id, is_learned)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          is_learned = VALUES(is_learned)
      `, [user_id, word_id, is_learned], 
      (err) => err ? reject(err) : resolve()
      );
    });

    return NextResponse.json({ 
      success: true,
      message: `Word marked as ${is_learned ? 'learned' : 'unlearned'}`
    });

  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { 
        error: "Progress update failed",
        details: error.message.includes('foreign key constraint') 
          ? "Invalid user_id or word_id" 
          : "Database error"
      },
      { status: 500 }
    );
  }
}