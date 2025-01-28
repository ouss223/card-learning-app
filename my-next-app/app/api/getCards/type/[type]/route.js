import { NextResponse } from "next/server";
import db from "../../../../../lib/db";
import { authenticateRequest } from "../../../authenticateRequest";

export async function GET(request, { params }) {
  try {
    const { type } = await params;
    const userId = authenticateRequest(request);
    let getCardsQuery = '';
    if (type === "community") {
      getCardsQuery = `
      select cards.* from cards left join users on cards.user_id = users.id where users.role = 'user'
  `;
    } else if (type === "official") {
      getCardsQuery = `
      select * from cards left join users on cards.user_id = users.id where users.role = 'admin'
  `;
    } else {
      return NextResponse.json(
        { error: "wrong type" },
        { status: 402 }
      );
    }

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

    return NextResponse.json(cards);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
