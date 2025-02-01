import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from "../authenticateRequest";

export async function GET(request) {
  try {
    const userId = authenticateRequest(request);
    const topXpQuery = `
            SELECT username,id, xp,image
            FROM users
            ORDER BY xp DESC
            LIMIT 10
        `;
    const topXpResult = await new Promise((resolve, reject) => {
        db.query(topXpQuery, (err, result) =>
            err ? reject(err) : resolve(result)
        );
        }
    );
    return NextResponse.json({
      message: "Global stats retrieved successfully",
      topXpResult,
    });

    
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error getting global stats", error: error.message },
      { status: 500 }
    );
  }
}
