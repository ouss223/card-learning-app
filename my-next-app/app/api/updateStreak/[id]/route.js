import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function PATCH(request, { params }) {
  const { id: userId } = params;

  try {
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const currentStats = await new Promise((resolve, reject) => {
      db.query(
        `SELECT daily_streak, last_login_date 
         FROM user_stats WHERE user_id = ?`,
        [userId],
        (err, result) => (err ? reject(err) : resolve(result[0]))
      );
    });

    if (!currentStats) {
      return NextResponse.json({
        success: false,
        message: "User not found."
      });
    }

    const { daily_streak, last_login_date } = currentStats;
    
    let lastLoginStr;
    if (last_login_date === null) {
      lastLoginStr = null;
    } else {
      const lastLoginDate = new Date(last_login_date);
      const year = lastLoginDate.getFullYear();
      const month = String(lastLoginDate.getMonth() + 1).padStart(2, '0');
      const day = String(lastLoginDate.getDate()).padStart(2, '0');
      const lastLoginUTC = new Date(`${year}-${month}-${day}T00:00:00Z`);
      lastLoginStr = lastLoginUTC.toISOString().split('T')[0];
    }

    let newStreak = daily_streak;

    if (last_login_date === null) {
      newStreak = 1;
    } else if (lastLoginStr === yesterdayStr) {
      newStreak = daily_streak + 1;
    } else if (lastLoginStr !== todayStr) {
      newStreak = 1;
    }

    await new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO user_stats (user_id, daily_streak, last_login_date)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          daily_streak = VALUES(daily_streak),
          last_login_date = VALUES(last_login_date)
      `, [userId, newStreak, todayStr], (err) => err ? reject(err) : resolve());
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