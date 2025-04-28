"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Listbox } from "@headlessui/react";

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

  const pageSize = 20;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/genres?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );
        const data = await response.json();
        setGenres(data.results);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const genreParam = selectedGenre ? `&genres=${selectedGenre.slug}` : "";
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page=${currentPage}&page_size=${pageSize}${genreParam}`
        );
        const data = await response.json();
        setGames(data.results);
        setTotalPages(Math.ceil(data.count / pageSize));
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentPage, selectedGenre]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <section className="flex flex-col flex-1 bg-zinc-900 text-gray-100 p-8 mt-17">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Explore Games
      </motion.h1>

      {/* Filtro de género */}
      <div className="flex justify-center mb-8 z-10">
        <Listbox value={selectedGenre} onChange={setSelectedGenre}>
          <div className="relative w-72">
            <Listbox.Button className="w-full bg-zinc-700 text-white rounded-lg py-2 px-4 text-left">
              {selectedGenre ? selectedGenre.name : "All Genres"}
            </Listbox.Button>
            <Listbox.Options className="absolute mt-1 max-h-90 w-full overflow-auto rounded-lg bg-zinc-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <Listbox.Option
                value={null}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-purple-500/20 text-white" : "text-gray-300"
                  }`
                }
              >
                All Genres
              </Listbox.Option>
              {genres.map((genre) => (
                <Listbox.Option
                  key={genre.id}
                  value={genre}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-purple-500/20 text-white" : "text-gray-300"
                    }`
                  }
                >
                  {genre.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading games...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl shadow-lg bg-zinc-800/50 border border-zinc-700/50 hover:scale-105 transition-transform duration-300 flex flex-col"
            >
              <Link href={`/game/${game.slug}`}>
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.background_image})` }}
                />
              </Link>

              <div className="p-4 flex flex-col flex-1">
                <div className="h-16 flex items-center justify-center mb-2 px-2 text-center">
                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight line-clamp-2">
                    {game.name}
                  </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  {game.genres.slice(0, 3).map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center gap-1 text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(game.rating) ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
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
              <path
                fill="currentColor"
                d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"
              />
            </svg>
          </button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (currentPage <= 3) {
              return page <= 5;
            } else if (currentPage >= totalPages - 2) {
              return page >= totalPages - 4;
            } else {
              return page >= currentPage - 2 && page <= currentPage + 2;
            }
          })
          .map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${
                page === currentPage
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-zinc-700/50 hover:bg-zinc-600 text-gray-300"
              }`}
            >
              {page}
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
              <path
                fill="currentColor"
                d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}