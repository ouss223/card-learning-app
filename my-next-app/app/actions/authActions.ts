"use server";

import { signOut, signIn } from "@/auth";

export const handleSignOut = async () => {
  await signOut({ redirectTo: "/" });
};

export const handleSignIn = async () => {
  await signIn("github", { redirectTo: "/home" });
};
