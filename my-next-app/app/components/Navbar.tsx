"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, signIn, useSession } from "next-auth/react";
import Notification from "./Notification";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [notification, setNotification] = React.useState<boolean | null>(null);
  const { data: session, status } = useSession();

  const text = "Are you sure you want to sign out?";
  const router = useRouter();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); 
  };
  
  

  return (
    <div className="px-10 py-10 bg-red-200 shadow-md font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image
            src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
            alt="logo"
            width={100}
            height={100}
            unoptimized
          />
        </Link>
        <div className="flex items-center gap-10 text-black">
          {session && session?.user ? (
            <div className="flex justify-between items-center gap-10">
              <Link href="/profile">
                <span>Profile</span>
              </Link>
              <span>{session?.user?.name}</span>
              <button onClick={() => setNotification(true)}>Sign Out</button>
            </div>
          ) : (
            <button onClick={()=>{
              router.push("/login");
            }} className="">
              Login
            </button>
          )}
        </div>
      </nav>
      {notification && (
        <Notification
          func={handleSignOut}
          text={text}
          cancel={setNotification}
          main_action={"sign out"}
        />
      )}
    </div>
  );
};

export default Navbar;
