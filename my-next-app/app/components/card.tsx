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
    <Link href={`/learning/${data.id}`}>
      <div
        className="p-4 gap-5 font-semibold flex flex-col justify-center rounded-lg text-white "
        style={{ backgroundColor: "#98a697" }}
      >
        <div>{data?.title}</div>
        <div>{data?.target_language}</div>
        <div>{data?.total_words} words</div>
        <div className="flex gap-10">
          <img
            width={50}
            height={50}
            src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Hellenic_pond_turtle_%28Emys_orbicularis_hellenica%29_Butrint.jpg"
            alt="Avatar"
            className="rounded-full object-cover"
          />
          <h2 className="bg-slate-500 text-sm rounded-xl flex items-center px-1">
            teacher
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default Card;
