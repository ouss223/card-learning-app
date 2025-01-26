"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams } from "next/navigation";
import Loading from "../../components/loading";
import { useSession } from "next-auth/react";

const Learning = () => {
  const [index, setIndex] = React.useState(0);
  const [side, setSide] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [terms, setTerms] = React.useState<string[][][][]>([]);//word/translated/id/learned?
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { data: session } = useSession();

  const { id } = useParams();

  React.useEffect(() => {
    const fetchCardData = async () => {
      try {
        console.log(session);
        const res = await fetch(`/api/getCard/${id}?user_id=${session?.user?.id}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setTitle(data.title);
        setTerms(data.cardData || []);
        setTerms((prev) => [...prev, ["done", "done", "done", "done"]]);
        
        setDescription(data.description);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchCardData();
  }, [id,session]);
  const HandleButtonPress = (action: string, know: boolean): void => {
    const sendProgress = async () => {
      try {
        const res = await fetch("/api/postProgress", {
          method: "POST",
          body: JSON.stringify({
            user_id: session?.user?.id,
            word_id: terms[index][2],
            is_learned: know,
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch");
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    sendProgress();
    setIndex((prev) => Math.min(prev + 1, terms.length - 1));
  };

  if (loading) return <Loading />;

  return (
    <div
      className="flex flex-col gap-5 min-h-screen pt-28 items-center"
      style={{
        background: "linear-gradient(145deg, #1e2b3a 0%, #2a3f54 100%)",
        color: "#ffffff",
      }}
    >
      <div className="text-center mb-8">
        <h1
          className="text-4xl font-bold mb-2"
          style={{
            letterSpacing: "0.5px",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {title}
        </h1>
        <h3
          className="text-xl opacity-80"
          style={{
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {description}
        </h3>
      </div>

      <div
        onClick={() => setSide((prev) => (prev === 0 ? 1 : 0))}
        className="cursor-pointer mt-6 text-center flex justify-center items-center text-3xl w-full max-w-2xl rounded-xl transition-transform hover:scale-[1.02]"
        style={{
          background:
            "linear-gradient(145deg, rgba(42,63,84,0.9) 0%, rgba(30,43,58,0.9) 100%)",
          minHeight: "300px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          border: "1px solid rgba(127,202,201,0.1)",
          padding: "2rem",
        }}
      >
        <span
          style={{
            color: terms[index]?.[side] ? "#7fcac9" : "rgba(255,255,255,0.5)",
          }}
        >
          {terms[index]?.[side] || "No term found"}
        </span>
      </div>

      <div className="flex items-center gap-8 mt-12">
        <button
          onClick={() => HandleButtonPress("add", false)}
          disabled={index === terms.length - 1}
          className="p-3 rounded-full transition-all"
          style={{
            background: "rgba(127,202,201,0.1)",
            opacity: index === terms.length - 1 ? 0.5 : 1,
            cursor: index === terms.length - 1 ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          dunno 🔴
        </button>

        <span
          className="text-xl font-medium"
          style={{
            color: "rgba(255,255,255,0.8)",
            minWidth: "100px",
            textAlign: "center",
          }}
        >
          {Math.min(index + 1,terms.length -1)} / {terms.length-1}
        </span>

        <button
          onClick={() => HandleButtonPress("add", true)}
          disabled={index === terms.length - 1}
          className="p-3 rounded-full transition-all"
          style={{
            background: "rgba(127,202,201,0.1)",
            opacity: index === terms.length - 1 ? 0.5 : 1,
            cursor: index === terms.length - 1 ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          know✅
        </button>
      </div>
      <div>
      <button
          onClick={() => setIndex((prev) => Math.min(prev -1, terms.length - 1))}
          disabled={index === 0}
          className="p-3 rounded-full transition-all"
          style={{
            background: "rgba(127,202,201,0.1)",
            opacity: index === 0 ? 0.5 : 1,
            cursor: index === 0 ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
      <FaArrowLeft className="h-8 w-8" style={{ color: "#7fcac9" }} />
      </button>
      </div>

    </div>
  );
};

export default Learning;
