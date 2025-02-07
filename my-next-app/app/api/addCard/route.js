import { NextResponse } from "next/server";
import db from "../../../lib/db";
import { authenticateRequest } from "../authenticateRequest";

export async function POST(request) {
  try {
    const { title, targetLanguage, description, words, edit, id,garbageCollector } =
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
            SET title = ?, target_language = ?, description = ?,total_words = ?
            WHERE id = ? AND user_id = ?
            `;
      const new_size = words.length;
      console.log(new_size);
      const cardResult = await new Promise((resolve, reject) => {
        db.query(
          updateCardQuery,
          [title, targetLanguage, description,new_size, id, userId],
          (err, result) => (err ? reject(err) : resolve(result))
        );
      });

      for (const word of words) {
        if (typeof word[2] === 'number') {
          const updateWordQuery = `
            UPDATE words
            JOIN cards ON words.card_id = cards.id
            SET word = ?, translated_word = ?
            WHERE words.id = ? 
              AND cards.user_id = ? 
              AND words.card_id = ?
          `;
          await new Promise((resolve, reject) => {
            db.query(
              updateWordQuery,
              [word[0], word[1], word[2], userId, id],
              (err, result) => (err ? reject(err) : resolve(result))
            );
          });
        } else {
          const insertQuery = `INSERT INTO words (word, translated_word, card_id) VALUES (?, ?, ?)`;
          await new Promise((resolve, reject) => {
            db.query(insertQuery, [word[0], word[1], id], (err, result) =>
              err ? reject(err) : resolve(result)
            );
          });
        }
        
      }
      for(const idd of garbageCollector){
      const deleteQuery1 = `DELETE FROM user_progress WHERE word_id = ?`;
        const deleteQuery2 = `DELETE FROM words WHERE id = ?`;
        await new Promise((resolve, reject) => {
          db.query(deleteQuery1, [idd], (err, result) =>
            err ? reject(err) : resolve(result)
          );
        });

        await new Promise((resolve, reject) => {
          db.query(deleteQuery2, [idd], (err, result) =>
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
