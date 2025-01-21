import React from "react";
import Link from "next/link";

interface CardProps {
  data: {
    title: string;
    target_language: string;
    total_words: number;
    id: string;
  };
}

const Card: React.FC<CardProps> = ({ data }) => {
  return (
    <Link href={`/learning/${data.id}`} style={{ textDecoration: "none" }}>
      <div
        className="p-6  flex flex-col gap-4 rounded-xl transition-all duration-300 hover:transform hover:translate-y-[-6px]"
        style={{
          background: "linear-gradient(145deg, #2a3f54 0%, #1e2b3a 100%)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "12px",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: 0,
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            {data.title}
          </h3>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#7fcac9",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: 500,
                border: "1px solid rgba(127,202,201,0.3)",
              }}
            >
              {data.target_language}
            </span>

            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px", fill: "currentColor" }}
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              {data.total_words} words
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              width={40}
              height={40}
              src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Hellenic_pond_turtle_%28Emys_orbicularis_hellenica%29_Butrint.jpg"
              alt="Avatar"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(127,202,201,0.5)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.85rem",
                }}
              >
                Created by
              </span>
              <span
                style={{
                  color: "#7fcac9",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                Language Expert
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#7fcac9",
              fontSize: "0.9rem",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s ease",
            }}
          >
            Start Now
            <svg
              style={{ width: "16px", height: "16px", fill: "currentColor" }}
              viewBox="0 0 24 24"
            >
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
