"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, signIn, useSession } from "next-auth/react";
import Notification from "./Notification";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { useEffect } from 'react';


import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [notification, setNotification] = React.useState<boolean | null>(null);
  const { data: session, status } = useSession();
  const [picked, setPicked] = React.useState<boolean>("");
  const router = useRouter();
  useEffect(() => {
    if (session) {
      console.log('Session:', session);
      const lastUpdated = Cookies.get('streakUpdated');
      const today = new Date().toISOString().split('T')[0];
      
      if (!lastUpdated || lastUpdated !== today) {
        const updateStreak = async () => {
          try {
            const response = await fetch(`/api/updateStreak`, {
              method: 'PATCH',
              credentials: 'include' ,
              headers : {
                authorization: `Bearer ${session.user.accessToken}`,
              }
            });

            
            if (response.ok) {
              console.log('Streak updated successfully' , session);
              const expires = new Date();
              expires.setUTCHours(23, 0, 0, 0);
              
              Cookies.set('streakUpdated', today, {
                expires: expires,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
              });
            }
          } catch (error) {
            console.error('Streak update failed:', error);
          }
        };

        updateStreak();
      }
    }
  }, [session]);

  const handleSignOut = () => {
    Cookies.remove('streakUpdated');
    signOut({ callbackUrl: "/" });
  };

  const navigation = [
    {
      name: "Profile",
      href: "/profile",
      current: router.pathname === "/profile",
    },
    {
      name: "Favorites",
      href: "/favorites",
      current: router.pathname === "/favorites",
    },
    {
      name: "home",
      href: "/home",
      current: router.pathname === "/home",
    },
    {
      name: "community",
      href: "/community",
      current: router.pathname === "/community",
    },
    {
      name: "create",
      href: "/cardAdd",
      current: router.pathname === "/cardAdd",
    },
    {
      name: "created",
      href: "/created",
      current: router.pathname === "/created",
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-800 shadow-md">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                className="block h-6 w-6 group-data-[open]:hidden"
                aria-hidden="true"
              />
              <XMarkIcon
                className="hidden h-6 w-6 group-data-[open]:block"
                aria-hidden="true"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/" onClick={() => setPicked("home")}>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
                  alt="TikTok Logo"
                  width={100}
                  height={100}
                  className="h-8 w-auto"
                  unoptimized
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {session?.user &&
                  navigation.map((item) => (
                    <Link
                    onClick={() => setPicked(item.name)}
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.name === picked 
                          ? "bg-gray-900 text-gray-200 text-l "
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {session?.user ? (
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={session.user.image || ""}
                      alt="User profile"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                      onClick={() => setPicked("Profile")}
                        href="/profile"
                        className={classNames(
                          focus ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Profile
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={() => setNotification(true)}
                        className={classNames(
                          focus ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {session?.user &&
            navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.name}
              </DisclosureButton>
            ))}
          {session?.user && (
            <DisclosureButton
              as="button"
              onClick={() => setNotification(true)}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Sign Out
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>

      {notification && (
        <Notification
          func={handleSignOut}
          text="Are you sure you want to sign out?"
          cancel={setNotification}
          main_action="sign out"
        />
      )}
    </Disclosure>
  );
};

export default Navbar;
