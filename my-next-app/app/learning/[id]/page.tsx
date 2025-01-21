"use client";

import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams } from "next/navigation";
import Loading from "../../components/loading";

const Learning = () => {
  const [index, setIndex] = React.useState(0);
  const [side, setSide] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [terms, setTerms] = React.useState<string[][]>([]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  
  const { id } = useParams();

  React.useEffect(() => {
    const fetchCardData = async () => {
      try {
        const res = await fetch(`/api/getCard/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        console.log("Data:", data);
        setTitle(data.title);
        setTerms(data.cardData || []); 
        setDescription(data.description);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-5 mt-20 text-black justify-center items-center">
      <h1 className="font-semibold text-4xl">{title}</h1>
      <h3 className="text-gray-600 text-2xl">{description}</h3>
      
      <div
        onClick={() => setSide(prev => prev === 0 ? 1 : 0)}
        className="Carditself cursor-pointer mt-14 text-gray-400 text-center flex justify-center items-center text-3xl w-1/2 bg-gray-800 h-48 rounded-lg"
      >
        {terms[index]?.[side] || "No term found"}
      </div>

      <div className="controls flex gap-10 mt-10">
        <button
          onClick={() => setIndex(prev => Math.max(prev - 1, 0))}
          disabled={index === 0}
        >
          <FaArrowLeft
            className={`h-10 w-10 ${
              index === 0 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-500 hover:scale-110 transition-transform"
            }`}
          />
        </button>
        
        <button
          onClick={() => setIndex(prev => Math.min(prev + 1, terms.length - 1))}
          disabled={index === terms.length - 1}
        >
          <FaArrowRight
            className={`h-10 w-10 ${
              index === terms.length - 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:scale-110 transition-transform"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default Learning;