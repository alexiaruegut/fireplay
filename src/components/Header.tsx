"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-zinc-900/50 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transform rotate-6 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2a9.98 9.98 0 0 1 7.743 3.671L13.414 12l6.329 6.329A9.98 9.98 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 4.697 14.477l.208-.157l-6.32-6.32l6.32-6.321l-.208-.156a7.97 7.97 0 0 0-4.394-1.517zm0 1a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Fireplay
          </h1>
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Home */}
          <div className="relative group flex items-center justify-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors relative group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.75 10a.75.75 0 0 0-1.5 0zm-14 0a.75.75 0 0 0-1.5 0zm14.72 2.53a.75.75 0 1 0 1.06-1.06zM12 3l.53-.53a.75.75 0 0 0-1.06 0zm-9.53 8.47a.75.75 0 1 0 1.06 1.06zM7 21.75h10v-1.5H7zM19.75 19v-9h-1.5v9zm-14 0v-9h-1.5v9zm15.78-7.53l-9-9l-1.06 1.06l9 9zm-10.06-9l-9 9l1.06 1.06l9-9zM17 21.75A2.75 2.75 0 0 0 19.75 19h-1.5c0 .69-.56 1.25-1.25 1.25zm-10-1.5c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 7 21.75z"
                />
              </svg>
            </Link>
            <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
              Home
            </div>
          </div>

          {/* Games */}
          <div className="relative group flex items-center justify-center">
            <Link
              href="/games"
              className="text-gray-300 hover:text-white transition-colors relative group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 48 48"
              >
                <path
                  fill="currentColor"
                  d="M16.25 18c.69 0 1.25.56 1.25 1.25V23h3.25a1.25 1.25 0 1 1 0 2.5H17.5v3.25a1.25 1.25 0 0 1-2.5 0V25.5h-3.75a1.25 1.25 0 0 1 0-2.5H15v-3.75c0-.69.56-1.25 1.25-1.25M32 27.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m1.5-4.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5M4 24c0-7.732 6.268-14 14-14h12c7.732 0 14 6.268 14 14s-6.268 14-14 14H18c-7.732 0-14-6.268-14-14m14-11.5c-6.351 0-11.5 5.149-11.5 11.5S11.649 35.5 18 35.5h12c6.351 0 11.5-5.149 11.5-11.5S36.351 12.5 30 12.5z"
                />
              </svg>
            </Link>
            <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
              Games
            </div>
          </div>

          {/* Perfil */}
          <div className="relative group flex items-center justify-center">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="text-gray-300 hover:text-white transition-colors relative group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="6" r="4" />
                  <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                </g>
              </svg>
            </Link>
            <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
              Profile
            </div>
          </div>

          {/* Logout (solo si logeado) */}
          {user && (
            <div className="relative group flex items-center justify-center">
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.496 21H6.5c-1.105 0-2-1.151-2-2.571V5.57c0-1.419.895-2.57 2-2.57h7" />
                  <path d="M16 15.5l3.5-3.5L16 8.5m-6.5 3.496h10" />
                </svg>
              </button>
              <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                Logout
              </div>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-300 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
