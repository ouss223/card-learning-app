import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function PATCH(request, { params }) {
  const { id: userId } = await params;
  
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let newStreak = 1;

    const currentStats = await new Promise((resolve, reject) => {
      db.query(
        `SELECT daily_streak, last_login_date 
         FROM user_stats WHERE user_id = ?`,
        [userId],
        (err, result) => err ? reject(err) : resolve(result[0])
      );
    });

    if (currentStats) {
      const lastLogin = currentStats.last_login_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLogin === yesterdayStr) {
        newStreak = currentStats.daily_streak + 1;
      } else if (lastLogin !== today) {
        newStreak = 1;
      } else {
        newStreak = currentStats.daily_streak;
      }
    }

    await new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO user_stats (user_id, daily_streak, last_login_date)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          daily_streak = VALUES(daily_streak),
          last_login_date = VALUES(last_login_date)
      `, [userId, newStreak, today], (err) => err ? reject(err) : resolve());
    });

    return NextResponse.json({
      success: true,
      streak: newStreak
    });

  } catch (error) {
    console.error("Streak update error:", error);
    return NextResponse.json(
      { error: "Failed to update daily streak" },
      { status: 500 }
    );
  }
}