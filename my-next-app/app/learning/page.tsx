import React from "react";

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
  const [i, seti] = React.useState<number | null>(0);
  return (
    <div className="felx flex-col gap-20">
      <h1>arabic terms</h1>
      <div>
        <h1>bla bla</h1>
        <h2>na na na</h2>
      </div>
      <div className="Carditself"></div>
      <div className="controls">
        <button onClick={() => seti(i - 1)} disabled={i === 0}>
          Previous
        </button>
        <button
          onClick={() => seti(i + 1)}
          disabled={i === Object.keys(spanishTerms).length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Learning;
