import React from "react";

const Card = () => {
  return (
    <div
      className="p-4 gap-10 font-semibold flex flex-col justify-center rounded-lg text-white"
      style={{ backgroundColor: "#98a697" }}
    >
      <div>spanish terms</div>
      <div>30 words</div>
      <div className="flex gap-10">
        <img
          width={50}
          height={50}
          src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Hellenic_pond_turtle_%28Emys_orbicularis_hellenica%29_Butrint.jpg"
          alt="Avatar"
          className="rounded-full object-cover"
        />
        <h2 className="bg-slate-500 text-sm rounded-xl flex items-center px-1">teacher</h2>
      </div>
    </div>
  );
};

export default Card;
