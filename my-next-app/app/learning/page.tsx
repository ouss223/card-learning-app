"use client";

import React from "react";

import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Learning = () => {
  const spanishTerms = {
    hola: "hello",
    adiós: "goodbye",
    gracias: "thank you",
    "por favor": "please",
    "buenos días": "good morning",
    "buenas noches": "good night",
    amigo: "friend",
    familia: "family",
    libro: "book",
    escuela: "school",
  };
  const termsArray = Object.entries(spanishTerms);
  const [i, seti] = React.useState<number | null>(0);
  const [j, setj] = React.useState<number | null>(0);
  return (
    <div className="flex flex-col gap-5 mt-20 text-black justify-center items-center">
      <h1 className="font-semibold text-4xl ">
        arabic terms
      </h1>
      <div>
        <h1>bla bla</h1>
        <h2>na na na</h2>
      </div>
      <div
        onClick={() => setj(j === 1 ? 0 : 1)}
        className="Carditself cursor-pointer mt-14 text-gray-400 text-center flex justify-center items-center text-3xl  w-1/2 bg-gray-800 h-48 rounded-lg"
      >
        {termsArray[i][j]}{" "}
      </div>
      <div className="controls flex gap-10 mt-10">
        <button
          className=""
          onClick={() => {
            seti(i - 1);
            setj(0);
          }}
          disabled={i === 0}
        >
          <FaArrowLeft
            style={i === 0 ? { color: "#acbfba" } : {}}
            className="h-10 w-10 text-gray-500 hover:scale-[1.18] transition-transform duration-200"
          />
        </button>
        <button
          className=""
          onClick={() => {
            seti(i + 1);
            setj(0);
          }}
          disabled={i === Object.keys(spanishTerms).length - 1}
        >
          <FaArrowRight
            style={
              i === Object.keys(spanishTerms).length - 1
                ? { color: "#acbfba" }
                : {}
            }
            className="h-10 w-10 text-gray-500 hover:scale-[1.18] transition-transform duration-200"
          />
        </button>
      </div>
    </div>
  );
};

export default Learning;
