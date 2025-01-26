import { NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function GET(request, { params }) {
  const { id: userId } = await params;

  try {
    const [progressData] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(
          `
          SELECT 
            COUNT(*) AS total_terms,
            SUM(is_learned) AS learned_terms
          FROM user_progress
          WHERE user_id = ?
        `,
          [userId],
          (err, result) => (err ? reject(err) : resolve(result[0] || {}))
        );
      }), 
    ]);

    const totalTermsLearned = progressData.learned_terms || 0;
    const accuracy =
      progressData.total_terms > 0
        ? (totalTermsLearned / progressData.total_terms) * 100
        : 0;
    const xp = totalTermsLearned * 17;

    await new Promise((resolve, reject) => {
      db.query(
        `
        INSERT INTO user_stats (
          user_id, 
          total_terms_learned, 
          accuracy, 
          xp
        )
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          total_terms_learned = VALUES(total_terms_learned),
          accuracy = VALUES(accuracy),
          xp = VALUES(xp)
      `,
        [userId, totalTermsLearned,  accuracy, xp],
        (err) => (err ? reject(err) : resolve())
      );
    });

    const userStats = await new Promise((resolve, reject) => {
      db.query(
        `SELECT daily_streak FROM user_stats WHERE user_id = ?`,
        [userId],
        (err, result) =>
          err ? reject(err) : resolve(result[0] || { daily_streak: 0 })
      );
    });

    return NextResponse.json({
      success: true,
      stats: {
        dailyStreak: userStats.daily_streak,
        totalTermsLearned,
        accuracy: Number(accuracy.toFixed(2)),
        xp,
      },
    });
  } catch (error) {
    console.error("Stats fetch/update error:", error);
    return NextResponse.json(
      { error: "Failed to process user stats" },
      { status: 500 }
    );
  }
}
