import db from '../../../lib/db';

export async function GET(req) {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW(),
      image VARCHAR(511)
    )`,
    `CREATE TABLE IF NOT EXISTS users_progress (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      user_id INT NOT NULL,
      progress INT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS cards (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      title VARCHAR(255) NOT NULL,
      description TEXT,
      target_language VARCHAR(255) NOT NULL,
      user_id INT NOT NULL,
      total_words INT DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS words (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      word VARCHAR(255) NOT NULL,
      card_id INT NOT NULL,
      translated_word VARCHAR(255),
      FOREIGN KEY (card_id) REFERENCES cards(id)
    )`,
    `CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      user_id INT NOT NULL,
      card_id INT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (card_id) REFERENCES cards(id)
    )`,

  ];
  

  for (const query of queries) {
    db.query(query, (err) => {
      if (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to create tables" }), { status: 500 });
      }
    });
  }

  return new Response(JSON.stringify({ message: "Tables created successfully!" }), { status: 200 });
}
