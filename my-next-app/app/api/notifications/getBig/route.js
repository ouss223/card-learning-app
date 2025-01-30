import db from "../../../../lib/db";
import { NextResponse } from "next/server";
import { authenticateRequest } from "../../authenticateRequest";
//later specify how much per call
export async function GET(request) {
  try {
    const userId = authenticateRequest(request);
    
    const notifs = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC ",
        [userId],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.length ? result : []);
        }
      );
    });
    //update is_read
    const updateNotifQuery = `
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ?;
  `;
    const notifResult = await new Promise((resolve, reject) => {
      db.query(
        updateNotifQuery,
        [userId],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    return NextResponse.json({ notifs });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to get notifs" },
      { status: 500 }
    );
  }
}
