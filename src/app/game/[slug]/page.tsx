"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface GameDetail {
  name: string;
  description_raw: string;
  background_image: string;
  released: string;
  rating: number;
  genres: { name: string }[];
  slug: string;
}

export default function GameDetailPage() {
  const { slug } = useParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [randomPrice, setRandomPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.rawg.io/api/games/${slug}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );
        const data = await res.json();
        setGame(data);
        const random = Math.floor(Math.random() * (80 - 30 + 1)) + 30;
        setRandomPrice(random);
      } catch (error) {
        console.error("Error fetching game detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchGameDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-4 text-xl font-bold text-red-500">Game not found.</p>
          <p className="mt-2 text-gray-400">
            Sorry, we couldn&#39;t find the requested game.
          </p>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const truncatedDescription =
    game.description_raw.length > 800
      ? game.description_raw.substring(0, 800) + "..."
      : game.description_raw;

  return (
    <div className="mt-10 bg-gradient-to-b from-zinc-900 to-zinc-950 text-gray-100 py-12 px-4 sm:px-6">
      <button
        onClick={() => window.history.back()}
        className="mb-4 inline-flex items-center text-sm font-medium text-purple-400 hover:text-pink-400 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Go Back
      </button>

      <div className="relative w-full max-w-7xl mx-auto mb-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div
          className="w-full h-[300px] sm:h-[400px] bg-cover bg-center"
          style={{ backgroundImage: `url(${game.background_image})` }}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10 bg-gradient-to-t from-zinc-900/95 to-transparent">
          <div className="flex justify-between items-end">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-lg">
              {game.name}
            </h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleFavorite}
              className="focus:outline-none"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  isFavorite
                    ? "text-[#E272DA]"
                    : "text-gray-400 hover:text-[#E272DA]"
                }
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {game.genres.map((genre, index) => (
              <span
                key={index}
                className="bg-purple-500/30 text-purple-200 px-4 py-1.5 text-sm rounded-full backdrop-blur-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-3xl overflow-hidden shadow-xl"
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                About the Game
              </h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {truncatedDescription}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/80 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Release Date
                  </h3>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-purple-400 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-white font-medium">
                      {game.released || "Not available"}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-800/80 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Rating
                  </h3>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {Array.from({ length: 5 }, (_, i) => {
                        const full = i + 1 <= Math.floor(game.rating);
                        const half =
                          i + 1 > Math.floor(game.rating) && i < game.rating;
                        return (
                          <svg
                            key={i}
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            {full ? (
                              <path
                                className="text-yellow-400"
                                d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                              />
                            ) : half ? (
                              <path
                                className="text-yellow-400"
                                d="M12 2L12 17.27L5.82 21L7.46 13.97L2 9.24L9.19 8.63L12 2Z"
                              />
                            ) : (
                              <path
                                className="text-gray-600"
                                d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                              />
                            )}
                          </svg>
                        );
                      })}
                    </div>
                    <p className="text-white font-medium">
                      {game.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-3xl overflow-hidden shadow-xl h-fit"
        >
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Price</h2>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 text-sm rounded-full">
                Available
              </span>
            </div>

            <div className="mb-8">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                €{randomPrice}
              </span>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add to Cart
              </button>

              <button className="w-full bg-zinc-700/50 hover:bg-zinc-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add to Favorites
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
