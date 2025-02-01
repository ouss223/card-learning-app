import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from "../authenticateRequest";

export async function GET(request) {
  try {
    const userId = authenticateRequest(request);
    const searchQueryQuery = `
            SELECT * FROM cards 
            WHERE title LIKE '%?%' OR description LIKE '%?%'
            LIMIT 10 OFFSET ?
            
        `;
    const offset = page * 10;

    const searchResult = await new Promise((resolve, reject) => {
      db.query(
        searchQueryQuery,
        [searchQuery, searchQuery, offset],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
    return NextResponse.json({
      message: "Cards retrieved successfully",
      searchResult,
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error retrieving cards", error: error.message },
      { status: 500 }
    );
  }
}
