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
    console.log(favorites);

    if (!favorites || favorites.length === 0) {
      return NextResponse.json({
        message: "No favorites found",
        favorites: [],
        fullFavorites: [],
      });
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
    const userIds = cards.map((card) => card.user_id);
    const getOwnersQuery = `
        SELECT * FROM users WHERE id IN (?)
    `;
    const owners = await new Promise((resolve, reject) => {
      db.query(getOwnersQuery, [userIds], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const ownersMap = owners.reduce((map, owner) => {
      map[owner.id] = owner;
      return map;
    }, {});

    for (const card of cards) {
      card.owner = ownersMap[card.user_id];
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
