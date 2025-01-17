import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from "@/auth";
const Navbar = async () => {
  const session = await auth();
  return (
<div className="px-10 py-10 bg-red-300 shadow-md font-work-sans" >
<nav className="flex justify-between items-center ">
        <Link href="/">
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
            alt="animal"
            width={100}
            height={100}
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-10 text-black">
          {session && session?.user ? (
            <div>
              <Link href="/profile">
                <a className="">Profile</a>
              </Link>
              <button onClick={() => signOut()} className="">
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className=""
              onClick={async () => {
                "use server";
                await signIn("github");
              }}
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
