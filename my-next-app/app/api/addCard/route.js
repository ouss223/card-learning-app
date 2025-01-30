import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from "../authenticateRequest";

export async function POST(request) {
  try {
    const { title, targetLanguage, description, words, edit, id } =
      await request.json();
    const userId = authenticateRequest(request);

    const cardData = {
      title,
      targetLanguage,
      description,
      words,
    };
    if (edit) {
      const updateCardQuery = `
            UPDATE cards
            SET title = ?, target_language = ?, description = ?
            WHERE id = ? AND user_id = ?
            `;
      const cardResult = await new Promise((resolve, reject) => {
        db.query(
          updateCardQuery,
          [title, targetLanguage, description, id, userId],
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });

      const insertQuery = `INSERT INTO words (word, translated_word, card_id) VALUES (?, ?, ?)`;

      for (const word of words) {
        await new Promise((resolve, reject) => {
          db.query(insertQuery, [word[0], word[1], id], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        });
      }

      return NextResponse.json({
        message: "Card edited successfully",
      });
    } else {
      const filteredWords = words.filter(
        ([word, trans]) => word.trim() && trans.trim()
      );
      const insertCardQuery = `
            INSERT INTO cards 
                (title, target_language, description, user_id, total_words)
            VALUES (?, ?, ?, ?, ?)
        `;

      const cardResult = await new Promise((resolve, reject) => {
        db.query(
          insertCardQuery,
          [title, targetLanguage, description, userId, filteredWords.length],
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });

      const cardId = cardResult.insertId;

      if (filteredWords.length > 0) {
        const insertWordQuery = `
                INSERT INTO words 
                    (word, translated_word, card_id)
                VALUES ?
            `;

        const wordValues = filteredWords.map(([word, translation]) => [
          word.trim(),
          translation.trim(),
          cardId,
        ]);

        await new Promise((resolve, reject) => {
          db.query(insertWordQuery, [wordValues], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        });
      }

      return NextResponse.json({
        message: "Card added successfully",
        cardData: { ...cardData, id: cardId },
      });
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Error adding card", error: error.message },
      { status: 500 }
    );
  }
}
