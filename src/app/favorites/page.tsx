"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";

interface FavGame {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  genres: { name: string }[];
  slug: string;
}

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [favs, setFavs] = useState<FavGame[]>([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        const favRef = collection(db, "users", u.uid, "favorites");
        const snap = await getDocs(favRef);
        const games = snap.docs
          .map((d) => {
            const data = d.data() as FavGame;
            if (!data.slug) return null;
            return {
              id: data.id!,
              name: data.name!,
              background_image: data.background_image!,
              rating: data.rating ?? 0,
              genres: data.genres ?? [],
              slug: data.slug!,
            };
          })
          .filter((g): g is FavGame => g !== null);
        setFavs(games);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const removeFavorite = async (gameId: number) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "favorites", gameId.toString());
    await deleteDoc(ref);
    setFavs((prev) => prev.filter((g) => g.id !== gameId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 p-8">
        <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-2xl text-center">
          <p className="text-gray-300 mb-4">
            You have to Sign In to see your favorites.
          </p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (favs.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 p-8">
        <div className="bg-zinc-800/50 backdrop-blur-md p-8 rounded-2xl text-center">
          <p className="text-gray-300 mb-4">
            You don&apos;t have any favorite games yet.
          </p>
          <Link
            href="/games"
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition"
          >
            Explore Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-zinc-900 text-gray-100 py-12 px-4 sm:px-6 mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
      >
        My Favorites
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {favs.map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl shadow-lg bg-zinc-800/50 border border-zinc-700/50 hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            <Link href={`/game/${game.slug}`}>
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${game.background_image})`,
                }}
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFavorite(game.id);
                  }}
                  className="mt-2 ml-2 bg-red-600/70 hover:bg-red-700/80 cursor-pointer text-white font-bold px-2.5 w-10 h-10 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="currentColor"
                      d="M2.854 2.146a.5.5 0 1 0-.708.708l1.271 1.27a4 4 0 0 0-.156.15c-1.688 1.705-1.68 4.476.016 6.189l6.277 6.34c.26.263.682.263.942 0l2.787-2.813l3.863 3.864a.5.5 0 0 0 .708-.708zm9.722 11.137l-2.55 2.575l-6.039-6.099c-1.313-1.326-1.314-3.47-.015-4.782q.074-.075.153-.145zm3.452-3.485l-2.045 2.064l.707.707l2.05-2.07a4.41 4.41 0 0 0-.016-6.187a4.306 4.306 0 0 0-6.135-.015l-.596.603l-.605-.61l-.1-.099a4.32 4.32 0 0 0-4.035-1.06l.874.874a3.32 3.32 0 0 1 2.55.988l.961.97a.5.5 0 0 0 .711 0L11.3 5a3.306 3.306 0 0 1 4.713.016a3.41 3.41 0 0 1 .016 4.78z"
                      stroke-width="0.4"
                      stroke="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </Link>

            <div className="p-4 flex flex-col flex-1">
              <div className="h-16 flex items-center justify-center mb-2 px-2 text-center">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight line-clamp-2">
                  {game.name}
                </h2>
              </div>

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

              <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < Math.round(game.rating) ? "★" : "☆"}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
