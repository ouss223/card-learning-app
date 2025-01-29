import { NextResponse } from "next/server";
import db from "@/lib/db";
import { authenticateRequest } from "../../authenticateRequest";

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const userId = authenticateRequest(request);
    const delQuery = `DELETE FROM notifications WHERE id = ? AND user_id = ?`;
    const result = await db.queryAsync(delQuery, [id, userId]);
    if(result.affectedRows === 0){
      return NextResponse.json(
        { error: "Failed to delete notif" },
        { status: 500 }
        );
    }
    return NextResponse.json({
        success: true,
        message: "notif deleted successfully",
      });
  } catch (error) {
    console.error("notif deletion error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
