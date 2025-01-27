import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from '../authenticateRequest'; 

export async function POST(request) {
  try {
    const { card_id, intent } = await request.json();
    const userId = authenticateRequest(request); 


    if (intent === "add") {
      const addfavoritesQuery =
        "INSERT INTO favorites (user_id,card_id) VALUES (?,?)";
      const favId = await new Promise((resolve, reject) => {
        db.query(addfavoritesQuery, [userId, card_id], (err, result) => {
          if (err) reject(err);
          else resolve(result.insertId);  
        });
      });

      return NextResponse.json({
        message: `Card added successfully to favorites with id: ${favId}`,
        favId,
      });
    } else if (intent === "remove") {
      const removefavoritesQuery =
        "DELETE FROM favorites WHERE user_id = ? AND card_id = ?";
      await new Promise((resolve, reject) => {
        db.query(removefavoritesQuery, [userId, card_id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      return NextResponse.json({
        message: "Card removed successfully from favorites",
      });
    }


    return NextResponse.json({ message: "Invalid intent" }, { status: 400 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error adding card", error: error.message },
      { status: 500 }
    );
  }
}
