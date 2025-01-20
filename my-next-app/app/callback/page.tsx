"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use 'next/router' for routing in Next.js 13
import { useSession } from "next-auth/react";

const CallbackPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      console.log("User session:", session.user?.email);
      // Call your registration API once session is available
      const registerUser = async () => {
        try {
          const response = await fetch("/api/register", {
            method: "POST", // Ensure you're using POST
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
              username: session.user.name,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("User registered successfully:", data);

            // Redirect to home page after successful registration
            
          } else {
            console.error("Registration failed:", await response.text());
          }
        } catch (error) {
          console.error("Error registering user:", error);
        }
      };

      registerUser();
      router.push("/home"); 
    }
  }, [session, router]);

  return (
        <div className="w-full h-screen flex justify-center items-center ">
          <div className="w-1/4  aspect-square  border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      
  );};

export default CallbackPage;
