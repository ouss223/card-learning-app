import db from "../../../../lib/db";
import { NextResponse } from "next/server";
import { authenticateRequest } from "../../authenticateRequest";

export async function GET(request) {
  try {
    const userId = authenticateRequest(request);
    
    const notifs = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 4",
        [userId],
        (err, result) => {
          if (err) reject(err);
          else resolve(result.length ? result : []);
        }
      );
    });
    let isThereNew = false;
    for(let i = 0; i < notifs.length; i++){
      if(notifs[i].is_read == 0){
        isThereNew = true;
        break;
      }
    }

    return NextResponse.json({ notifs,new: isThereNew });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to get notifs" },
      { status: 500 }
    );
  }
}
