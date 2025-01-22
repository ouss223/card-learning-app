import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import db from "../../../lib/db";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const photoFile = formData.get("photo");

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUsers = await db.queryAsync(
      `SELECT id FROM users WHERE email = ? OR username = ?`,
      [email, username]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    let photoUrl = null;
    if (photoFile instanceof Blob) {
      try {
        const buffer = Buffer.from(await photoFile.arrayBuffer());
        const processedImage = await sharp(buffer)
          .resize(500, 500)
          .webp()
          .toBuffer();

        const photoName = `${uuidv4()}.webp`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const photoPath = path.join(uploadDir, photoName);
        await fs.writeFile(photoPath, processedImage);
        photoUrl = `/uploads/${photoName}`;
      } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json(
          { error: "Failed to process image" },
          { status: 500 }
        );
      }
    }

    const hashedPassword = await hash(password, 12);

    const result = await db.queryAsync(
      `INSERT INTO users 
       (email, password, username, image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, username, photoUrl, new Date(), new Date()]
    );

    return NextResponse.json(
      { user: { id: result.insertId, email, username } },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}