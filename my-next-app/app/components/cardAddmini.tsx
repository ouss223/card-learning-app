import React from "react";

const cardAddmini = () => {
  return (
    <div className="flex gap-x-4 sm:col-span-2 mt-8 items-center justify-center">
      <div className="flex flex-col h-20 justify-center items-center">
        <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
          Word
        </label>
        <div className="mt-2.5">
          <input
            id="first-name"
            name="first-name"
            type="text"
            autoComplete="given-name"
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
      </div>
      <div className="flex flex-col h-20 justify-center items-center">
        <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
          Translated Word
        </label>
        <div className="mt-2.5">
          <input
            id="last-name"
            name="last-name"
            type="text"
            autoComplete="family-name"
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

export default cardAddmini;
