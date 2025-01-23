"use client";

import React, { useEffect } from "react";
import Card from "../components/card";
import Loading from "../components/loading";

const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const [cards, setCards] = React.useState([]);

  useEffect(() => {
    const retrieveCards = async () => {
      const res = await fetch("http://localhost:3000/api/getCards");
      const data = await res.json();
      setCards(data);
      console.log(data);
    };
    try {
      retrieveCards();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 gap-4 p-4 px-12 pt-12">
          {Array.from({ length: cards.length }).map((_, index) => (
            <Card key={index} data={cards[index]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
