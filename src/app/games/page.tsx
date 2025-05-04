"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Listbox } from "@headlessui/react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  genres: { name: string }[];
  slug: string;
}
interface Genre {
  id: number;
  name: string;
  slug: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<import("firebase/auth").User | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);

  const pageSize = 20;

  useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDocs(collection(db, "users", u.uid, "favorites"));
        setFavorites(snap.docs.map((d) => parseInt(d.id)));
        const cartSnap = await getDocs(collection(db, "users", u.uid, "cart"));
        setCart(cartSnap.docs.map((d) => parseInt(d.id)));
      } else {
        setFavorites([]);
      }
    });
  }, []);

  useEffect(() => {
    fetch(
      `https://api.rawg.io/api/genres?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
    )
      .then((r) => r.json())
      .then((d) => setGenres(d.results))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const genreParam = selectedGenre ? `&genres=${selectedGenre.slug}` : "";
    fetch(
      `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}` +
        `&page=${currentPage}&page_size=${pageSize}` +
        genreParam
    )
      .then((r) => r.json())
      .then((d) => {
        setGames(d.results);
        setTotalPages(Math.ceil(d.count / pageSize));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentPage, selectedGenre]);

  const toggleFavorite = async (game: Game) => {
    if (!user) {
      setShowFavModal(true);
      return;
    }

    const ref = doc(db, "users", user.uid, "favorites", game.id.toString());

    if (favorites.includes(game.id)) {
      await deleteDoc(ref);
      setFavorites((prev) => prev.filter((id) => id !== game.id));
    } else {
      await setDoc(ref, {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        genres: game.genres,
        slug: game.slug,
      });
      setFavorites((prev) => [...prev, game.id]);
    }
  };

  const toggleCart = async (game: Game) => {
    if (!user) {
      setShowCartModal(true);
      return;
    }

    const ref = doc(db, "users", user.uid, "cart", game.id.toString());

    if (cart.includes(game.id)) {
      await deleteDoc(ref);
      setCart((prev) => prev.filter((id) => id !== game.id));
    } else {
      const randomPrice = Math.floor(Math.random() * (80 - 30 + 1)) + 30;
      await setDoc(ref, {
        id: game.id,
        name: game.name,
        slug: game.slug,
        background_image: game.background_image,
        price: randomPrice,
      });
      setCart((prev) => [...prev, game.id]);
    }
  };

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <section className="flex flex-col flex-1 bg-zinc-900 text-gray-100 p-8 mt-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Explore Games
      </motion.h1>

      {/* filtro género */}
      <div className="flex justify-center mb-8 z-100">
        <Listbox value={selectedGenre} onChange={setSelectedGenre}>
          <div className="relative w-72">
            <Listbox.Button className="w-full bg-zinc-700 text-white rounded-lg py-2 px-4 text-left">
              {selectedGenre?.name || "All Genres"}
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 w-full bg-zinc-800 rounded-lg py-1 shadow-lg max-h-60 overflow-auto">
              <Listbox.Option
                value={null}
                className="cursor-pointer p-2 hover:bg-purple-500/20"
              >
                All Genres
              </Listbox.Option>
              {genres.map((g) => (
                <Listbox.Option
                  key={g.id}
                  value={g}
                  className="cursor-pointer p-2 hover:bg-purple-500/20"
                >
                  {g.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {loading ? (
        <div className="flex items-center justify-center bg-zinc-900">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading games...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl shadow-lg bg-zinc-800/50 border border-zinc-700/50 hover:scale-105 transition-transform duration-300 flex flex-col"
            >
              {/* imagen */}
              <Link
                href={`/game/${game.slug}`}
                className="h-48 bg-cover bg-center block"
                style={{ backgroundImage: `url(${game.background_image})` }}
              />

              {/* contenido */}
              <div className="p-4 flex flex-col flex-1">
                {/* título */}
                <div className="h-16 flex items-center justify-center mb-2 px-2 text-center">
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight line-clamp-2">
                    {game.name}
                  </h2>
                </div>
                {/* géneros */}
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {game.genres.slice(0, 3).map((g, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
                {/* favs + rating + carrito */}
                <div className="flex justify-between items-center mt-auto">
                  <button
                    onClick={() => toggleFavorite(game)}
                    className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-zinc-700/50"
                  >
                    {favorites.includes(game.id) ? (
                      <svg
                        width="22"
                        height="22"
                        fill="#E272DA"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    ) : (
                      <svg
                        width="22"
                        height="22"
                        fill="none"
                        stroke="#E272DA"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    )}
                  </button>
                  <div className="flex justify-center gap-1 text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < Math.round(game.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-zinc-700/50">
                    <button
                      onClick={() => toggleCart(game)}
                      className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-zinc-700/50"
                    >
                      {cart.includes(game.id) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M9.5 19.5a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 1a2 2 0 1 0 0-4a2 2 0 0 0 0 4m7-1a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 1a2 2 0 1 0 0-4a2 2 0 0 0 0 4M3 4a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .476.348L9.37 14.5H17a.5.5 0 0 1 0 1H9.004a.5.5 0 0 1-.476-.348L5.135 4.5H3.5A.5.5 0 0 1 3 4"
                            clipRule="evenodd"
                          />
                          <path
                            fill="currentColor"
                            d="M8.5 13L6 6h13.337a.5.5 0 0 1 .48.637l-1.713 6a.5.5 0 0 1-.481.363z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          >
                            <circle cx="10" cy="19" r="1.5" />
                            <circle cx="17" cy="19" r="1.5" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.5 4h2l3.504 11H17"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.224 12.5L6.3 6.5h12.507a.5.5 0 0 1 .475.658l-1.667 5a.5.5 0 0 1-.474.342z"
                            />
                          </g>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* paginación */}
      <div className="flex justify-center gap-2 mt-8 flex-wrap">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:text-pink-500 text-gray-300 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m10.8 12l3.9 3.9q..." />
            </svg>
          </button>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            if (currentPage <= 3) return p <= 5;
            if (currentPage >= totalPages - 2) return p > totalPages - 5;
            return p >= currentPage - 2 && p <= currentPage + 2;
          })
          .map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                p === currentPage
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-zinc-700/50 hover:bg-zinc-600 text-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:text-pink-500 text-gray-300 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M12.6 12L8.7 8.1..." />
            </svg>
          </button>
        )}
      </div>
      {showCartModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 to-pink-600 max-w-md w-full shadow-xl">
            <div className="bg-zinc-900 text-white p-8 rounded-[14px] text-center">
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-300 mb-6">
                To add a game to your cart, please log in.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowCartModal(false)}
                  className="px-4 py-2 bg-zinc-700 rounded-full hover:bg-zinc-600"
                >
                  Close
                </button>
                <Link
                  href="/login"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:bg-purple-700 transition cursor-pointer hover:from-purple-700 hover:to-pink-700"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFavModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 to-pink-600 max-w-md w-full shadow-xl">
            <div className="bg-zinc-900 text-white p-8 rounded-[14px] text-center">
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className="text-gray-300 mb-6">
                To add a game to your favorites, please log in.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowFavModal(false)}
                  className="px-4 py-2 bg-zinc-700 rounded-full hover:bg-zinc-600"
                >
                  Close
                </button>
                <Link
                  href="/login"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:bg-purple-700 transition cursor-pointer hover:from-purple-700 hover:to-pink-700"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
