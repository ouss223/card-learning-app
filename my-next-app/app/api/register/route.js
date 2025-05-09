import { ok } from "assert";
import db from "../../../lib/db";
import { NextResponse } from 'next/server';
import { stat } from "fs";

export async function POST(request) {
  try {
    const { email, username } = await request.json();
    console.log("Data:", email, username);

    const checkQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
    
    db.query(checkQuery, [email, username], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        return NextResponse.json({ message: "Database error" });
      }
      
      if (rows.length > 0) {
        return NextResponse.json({ message: "User already exists. It's aight!"  },{ status: 200 });
      }

      const query = "INSERT INTO users (username, email) VALUES (?, ?)";
      
      db.query(query, [username, email], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return NextResponse.json({ message: "Database error" });
        }
        return NextResponse.json({ message: "User registered successfully", result });
      });
    });
    return NextResponse.json({ message: "User registered " });
    
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ message: "Error registering user", error: error.message });
  }
  
}
