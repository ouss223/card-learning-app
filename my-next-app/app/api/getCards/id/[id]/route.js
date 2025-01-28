import { NextResponse } from "next/server";
import db from "../../../../../lib/db";

export async function GET(request, { params }) {
  const { id } = await  params;

  try {
    const getCardsQuery = `SELECT * FROM cards WHERE user_id = ?`;
    const cards = await new Promise((resolve, reject) => {
      db.query(getCardsQuery, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const userQuery = `SELECT id, username, email, image FROM users WHERE id = ?`;
    const user = await new Promise((resolve, reject) => {
      db.query(userQuery, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (cards.length === 0) {
      return NextResponse.json(
        { error: "No cards found for this user" },
        { status: 404 }
      );
    }

    const cardsWithOwner = cards.map((card) => ({
      ...card,
      owner: user[0],
    }));

    return NextResponse.json(cardsWithOwner); 
  } catch (error) {
    console.error("Error fetching user cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch user cards" },
      { status: 500 }
    );
  }
}
