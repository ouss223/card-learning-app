import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from "../authenticateRequest";

export async function GET(request) {
  try {
    const userId = authenticateRequest(request);

    const { searchQuery, page } = Object.fromEntries(
      new URL(request.url).searchParams
    );

    const offset = parseInt(page, 10) * 10;

    const searchQueryQuery = `
      SELECT * FROM cards 
      WHERE title LIKE ? OR description LIKE ? 
      LIMIT 10 OFFSET ?
    `;

    const searchResult = await new Promise((resolve, reject) => {
      db.query(
        searchQueryQuery,
        [`%${searchQuery}%`, `%${searchQuery}%`, offset],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    return NextResponse.json({
      message: "Cards retrieved successfully",
      searchResult,
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "Error retrieving cards", error: error.message },
      { status: 500 }
    );
  }
}
