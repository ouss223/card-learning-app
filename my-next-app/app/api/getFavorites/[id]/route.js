import db from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const favorites = await new Promise((resolve, reject) => {
      db.query(
        "SELECT card_id FROM favorites WHERE user_id = ?",
        [id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (!favorites) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    const array = [];
    const cards = [];
    for (let i = 0; i < favorites.length; i++) {
      array.push(favorites[i].card_id);
      const card = await new Promise((resolve, reject) => {
        db.query(
          "SELECT * FROM cards WHERE id = ?",
          [favorites[i].card_id],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      cards.push(card[0]);
    }
    return NextResponse.json({
      message: "favorites retrieved successfully",
      favorites: array,
      fullFavorites: cards,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch card data" },
      { status: 500 }
    );
  }
}
