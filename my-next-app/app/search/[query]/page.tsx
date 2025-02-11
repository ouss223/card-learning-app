"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import CardsPage from "../../components/cardsPage";

const page = () => {
  const search = useParams().query;
  const { data: session, status } = useSession();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await fetch(
          `/api/search?searchQuery=${search}&page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to search");
          return;
        }

        console.log("Search success");
        const data = await response.json();
        console.log(data);
        setCards(data.cards);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    handleSearch();
  }, [search]);

  return     <CardsPage type={"official"} readyCards={cards} />
  ;
};

export default page;
