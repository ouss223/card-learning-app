import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import { authenticateRequest } from "../../authenticateRequest";

export async function POST(request, { params }) {
  const userId = authenticateRequest(request);

  try {
    const { field, value } = await request.json();

    const allowedFields = ["bio", "country"]; 
    if (!allowedFields.includes(field)) {
      return NextResponse.json(
        { error: "Invalid field" },
        { status: 400 }
      );
    }

    const updateQuery = `UPDATE users SET ${field} = ? WHERE id = ?`;
    const result = await new Promise((resolve, reject) => {
      db.query(updateQuery, [value, userId], (err, result) =>
        err ? reject(err) : resolve(result)
      );
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("User info update error:", error);
    return NextResponse.json(
      { error: "Failed to update user info" },
      { status: 500 }
    );
  }
}