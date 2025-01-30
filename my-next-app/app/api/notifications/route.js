import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from "../authenticateRequest";

export async function POST(request) {
  try {
    const userId = authenticateRequest(request);
    const { type, content } = await request.json();
    const checkUserQuery = `
            SELECT role FROM users WHERE id = ?
        `;
    const userResult = await new Promise((resolve, reject) => {
      db.query(checkUserQuery, [userId], (err, result) =>
        err ? reject(err) : resolve(result)
      );
    });
    if (userResult[0].role !== "admin") {
      return NextResponse.json(
        { message: "You are not authorized to add a notif" },
        { status: 401 }
      );
    }
    const notifData = {
      type,
      content,
    };
    const insertNotifQuery = `
    INSERT INTO notifications (user_id, type, content,is_read, created_at)
    SELECT id, ?, ?, ?, ?
    FROM users;
  `;

    const notifResult = await new Promise((resolve, reject) => {
      db.query(
        insertNotifQuery,
        [type, content, 0, new Date()],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
    return NextResponse.json({
      message: "Notif added successfully",
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error adding notif", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const userId = authenticateRequest(request);
    const { notifs } = await request.json();
    const updateNotifQuery = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?;
  `;
    for (let i = 0; i < notifs.length; i++) {
      const notifResult = await new Promise((resolve, reject) => {
        db.query(updateNotifQuery, [notifs[i].id], (err, result) =>
          err ? reject(err) : resolve(result)
        );
      });
    }
    return NextResponse.json(
      { message: "sucessfully set the notifs to read" }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error adding notif", error: error.message },
      { status: 500 }
    );
  }
}
