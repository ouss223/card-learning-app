import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET(request) {
  try {
    const getCardsQuery = `
            SELECT * FROM cards
        `;

    const cards = await new Promise((resolve, reject) => {
      db.query(getCardsQuery, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
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
    console.log(cards);

    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
