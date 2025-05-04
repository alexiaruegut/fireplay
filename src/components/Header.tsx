"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function Header() {
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  interface Game {
    id: number;
    slug: string;
    name: string;
    background_image: string;
  }

  const [results, setResults] = useState<Game[]>([]);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

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

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games?search=${query}&key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Error searching:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(target)
      ) {
        setIsDesktopDropdownOpen(false);
      }

      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target)
      ) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-zinc-900/50 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* logo */}
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

        <div className="relative w-full max-w-xs mx-4 hidden md:block">
          <input
            type="text"
            placeholder="Search games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="w-full px-4 py-2 rounded-xl bg-zinc-700 text-white placeholder-gray-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {query && results.length > 0 && (
            <div className="absolute mt-2 w-full bg-zinc-800 rounded-lg shadow-lg max-h-60 overflow-auto z-50 scrollbar-thin">
              {results.map((game) => (
                <Link
                  key={game.id}
                  href={`/game/${game.slug}`}
                  className="flex items-center gap-3 p-2 hover:bg-purple-600/20 transition-colors"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="text-sm text-white">{game.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* menu nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* home */}
          <Link
            href="/"
            className="relative group flex items-center justify-center"
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
            <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
              Home
            </div>
          </Link>

          {/* games */}
          <Link
            href="/games"
            className="relative group flex items-center justify-center"
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
            <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
              Games
            </div>
          </Link>

          {/* profile */}
          <Link
            href={user ? "/dashboard" : "/login"}
            className="relative group flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="6" r="4" />
                <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
              </g>
            </svg>
            <div className="absolute top-full mt-2 hidden group-hover:flex bg-zinc-800 text-gray-300 text-xs rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
              Profile
            </div>
          </Link>

          {/* más menú */}
          <div className="relative" ref={desktopDropdownRef}>
            <button
              onClick={() => setIsDesktopDropdownOpen((prev) => !prev)}
              className="text-gray-300 hover:text-white flex items-center gap-1"
            >
              More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDesktopDropdownOpen && (
              <div className="absolute right-0 mt-5 w-48 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-2 z-50">
                {/* favs */}
                <Link
                  href="/favorites"
                  className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 transition flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12.001 4.529a6 6 0 0 1 8.242.228a6 6 0 0 1 .236 8.236l-8.48 8.492l-8.478-8.492a6 6 0 0 1 8.48-8.464m6.826 1.641a4 4 0 0 0-5.49-.153l-1.335 1.198l-1.336-1.197a4 4 0 0 0-5.686 5.605L12 18.654l7.02-7.03a4 4 0 0 0-.193-5.454"
                    />
                  </svg>
                  Favorites
                </Link>

                {/* cart */}
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 transition flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
                      stroke-width="0.5"
                      stroke="currentColor"
                    />
                  </svg>
                  Cart
                </Link>

                {/* contact us */}
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-sm text-white hover:bg-zinc-700 transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="24"
                    viewBox="0 0 26 30"
                  >
                    <path
                      fill="currentColor"
                      d="m7.92 2.645l1.66-.5a3.25 3.25 0 0 1 3.903 1.779l1.033 2.298a3.25 3.25 0 0 1-.748 3.71l-1.805 1.683a.3.3 0 0 0-.054.073c-.189.386.098 1.417.997 2.975c1.014 1.756 1.797 2.45 2.16 2.343l2.369-.725a3.25 3.25 0 0 1 3.585 1.207l1.468 2.033a3.25 3.25 0 0 1-.4 4.262l-1.263 1.195a3.75 3.75 0 0 1-3.342.949c-3.517-.732-6.668-3.564-9.48-8.434C5.19 12.62 4.313 8.47 5.443 5.057a3.75 3.75 0 0 1 2.478-2.412m.434 1.436a2.25 2.25 0 0 0-1.487 1.447c-.974 2.941-.185 6.677 2.435 11.215c2.618 4.535 5.456 7.085 8.487 7.715a2.25 2.25 0 0 0 2.005-.57l1.262-1.194a1.75 1.75 0 0 0 .216-2.295l-1.468-2.034a1.75 1.75 0 0 0-1.93-.65l-2.375.727c-1.314.391-2.55-.704-3.892-3.03c-1.137-1.968-1.531-3.39-1.045-4.383q.142-.29.378-.511l1.805-1.683a1.75 1.75 0 0 0 .403-1.998L12.115 4.54a1.75 1.75 0 0 0-2.102-.958z"
                      stroke-width="0.2"
                      stroke="currentColor"
                    />
                  </svg>
                  Contact Us
                </Link>

                {/* about us */}
                <Link
                  href="/about"
                  className="block px-4 py-2 text-sm text-white hover:bg-zinc-700 transition flex items-center gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 11v5m0 5a9 9 0 1 1 0-18a9 9 0 0 1 0 18m.05-13v.1h-.1V8z"
                    />
                  </svg>
                  About Us
                </Link>

                {/* logout */}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 transition flex items-center gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* pantallas peques boton menú */}
        <div className="relative md:hidden" ref={mobileDropdownRef}>
          <button
            onClick={() => setIsMobileDropdownOpen((prev) => !prev)}
            className="text-gray-300 hover:text-white flex items-center gap-1"
          >
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

          {isMobileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-4 z-50 md:hidden space-y-2 px-4">
              {/* searchbar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-4 py-2 rounded-xl bg-zinc-700 text-white placeholder-gray-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {query && results.length > 0 && (
                  <div className="absolute mt-2 w-full bg-zinc-900 rounded-lg shadow-lg max-h-60 overflow-auto z-50 scrollbar-thin border border-zinc-700">
                    {results.map((game) => (
                      <Link
                        key={game.id}
                        href={`/game/${game.slug}`}
                        className="flex items-center gap-3 p-2 hover:bg-purple-600/20 transition-colors"
                        onClick={() => {
                          setQuery("");
                          setResults([]);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="text-sm text-white">{game.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {/* home */}
              <Link
                href="/"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19.75 10a.75.75 0 0 0-1.5 0zm-14 0a.75.75 0 0 0-1.5 0zm14.72 2.53a.75.75 0 1 0 1.06-1.06zM12 3l.53-.53a.75.75 0 0 0-1.06 0zm-9.53 8.47a.75.75 0 1 0 1.06 1.06zM7 21.75h10v-1.5H7zM19.75 19v-9h-1.5v9zm-14 0v-9h-1.5v9zm15.78-7.53l-9-9l-1.06 1.06l9 9zm-10.06-9l-9 9l1.06 1.06l9-9zM17 21.75A2.75 2.75 0 0 0 19.75 19h-1.5c0 .69-.56 1.25-1.25 1.25zm-10-1.5c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 7 21.75z"
                  />
                </svg>
                Home
              </Link>

              {/* games */}
              <Link
                href="/games"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 52 52"
                >
                  <path
                    fill="currentColor"
                    d="M16.25 18c.69 0 1.25.56 1.25 1.25V23h3.25a1.25 1.25 0 1 1 0 2.5H17.5v3.25a1.25 1.25 0 0 1-2.5 0V25.5h-3.75a1.25 1.25 0 0 1 0-2.5H15v-3.75c0-.69.56-1.25 1.25-1.25M32 27.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m1.5-4.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5M4 24c0-7.732 6.268-14 14-14h12c7.732 0 14 6.268 14 14s-6.268 14-14 14H18c-7.732 0-14-6.268-14-14m14-11.5c-6.351 0-11.5 5.149-11.5 11.5S11.649 35.5 18 35.5h12c6.351 0 11.5-5.149 11.5-11.5S36.351 12.5 30 12.5z"
                  />
                </svg>
                Games
              </Link>

              {/* favs */}
              <Link
                href="/favorites"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12.001 4.529a6 6 0 0 1 8.242.228a6 6 0 0 1 .236 8.236l-8.48 8.492l-8.478-8.492a6 6 0 0 1 8.48-8.464m6.826 1.641a4 4 0 0 0-5.49-.153l-1.335 1.198l-1.336-1.197a4 4 0 0 0-5.686 5.605L12 18.654l7.02-7.03a4 4 0 0 0-.193-5.454"
                  />
                </svg>
                Favorites
              </Link>

              {/* cart */}
              <Link
                href="/cart"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
                    strokeWidth="0.5"
                    stroke="currentColor"
                  />
                </svg>
                Cart
              </Link>

              {/* profile */}
              <Link
                href={user ? "/dashboard" : "/login"}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="6" r="4" />
                    <path d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5Z" />
                  </g>
                </svg>
                Profile
              </Link>

              {/* contact us */}
              <Link
                href={"/contact"}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-5"
                  viewBox="0 0 24 28"
                >
                  <path
                    fill="currentColor"
                    d="m7.92 2.645l1.66-.5a3.25 3.25 0 0 1 3.903 1.779l1.033 2.298a3.25 3.25 0 0 1-.748 3.71l-1.805 1.683a.3.3 0 0 0-.054.073c-.189.386.098 1.417.997 2.975c1.014 1.756 1.797 2.45 2.16 2.343l2.369-.725a3.25 3.25 0 0 1 3.585 1.207l1.468 2.033a3.25 3.25 0 0 1-.4 4.262l-1.263 1.195a3.75 3.75 0 0 1-3.342.949c-3.517-.732-6.668-3.564-9.48-8.434C5.19 12.62 4.313 8.47 5.443 5.057a3.75 3.75 0 0 1 2.478-2.412m.434 1.436a2.25 2.25 0 0 0-1.487 1.447c-.974 2.941-.185 6.677 2.435 11.215c2.618 4.535 5.456 7.085 8.487 7.715a2.25 2.25 0 0 0 2.005-.57l1.262-1.194a1.75 1.75 0 0 0 .216-2.295l-1.468-2.034a1.75 1.75 0 0 0-1.93-.65l-2.375.727c-1.314.391-2.55-.704-3.892-3.03c-1.137-1.968-1.531-3.39-1.045-4.383q.142-.29.378-.511l1.805-1.683a1.75 1.75 0 0 0 .403-1.998L12.115 4.54a1.75 1.75 0 0 0-2.102-.958z"
                    stroke-width="0.2"
                    stroke="currentColor"
                  />
                </svg>
                Contact Us
              </Link>

              {/* about us */}
              <Link
                href={"/about"}
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 11v5m0 5a9 9 0 1 1 0-18a9 9 0 0 1 0 18m.05-13v.1h-.1V8z"
                  />
                </svg>
                About Us
              </Link>

              {/* logout */}
              {user && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-zinc-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
