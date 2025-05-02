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

  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const pageSize = 20;

  useEffect(() => {
    return auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDocs(collection(db, "users", u.uid, "favorites"));
        setFavorites(snap.docs.map((d) => parseInt(d.id)));
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
      alert("To add favorites, please log in.");
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

      {/* Filtro de género */}
      <div className="flex justify-center mb-8">
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
              <Link legacyBehavior href={`/game/${game.slug}`}>
                <a
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.background_image})` }}
                />
              </Link>

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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-9-1a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1M18 6H4.27l2.55 6H15c.33 0 .62-.16.8-.4l3-4c.13-.17.2-.38.2-.6a1 1 0 0 0-1-1m-3 7H6.87l-.77 1.56L6 15a1 1 0 0 0 1 1h11v1H7a2 2 0 0 1-2-2a2 2 0 0 1 .25-.97l.72-1.47L2.34 4H1V3h2l.85 2H18a2 2 0 0 1 2 2c0 .5-.17.92-.45 1.26l-2.91 3.89c-.36.51-.96.85-1.64.85"
                      />
                    </svg>
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
    </section>
  );
}
