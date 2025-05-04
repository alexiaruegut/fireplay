"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDocs, deleteDoc, setDoc } from "firebase/firestore";
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
  const [inCartIds, setInCartIds] = useState<number[]>([]);

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

        const cartRef = collection(db, "users", u.uid, "cart");
        const cartSnap = await getDocs(cartRef);
        const cartIds = cartSnap.docs.map((d) => parseInt(d.id));
        setInCartIds(cartIds);
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

  const toggleCart = async (game: FavGame) => {
    const user = auth.currentUser;
    if (!user) {
      alert("To manage cart, please log in.");
      return;
    }

    const price = Math.floor(Math.random() * (80 - 30 + 1)) + 30;
    const cartRef = doc(db, "users", user.uid, "cart", game.id.toString());

    if (inCartIds.includes(game.id)) {
      await deleteDoc(cartRef);
      setInCartIds((prev) => prev.filter((id) => id !== game.id));
    } else {
      await setDoc(cartRef, {
        id: game.id,
        name: game.name,
        slug: game.slug,
        background_image: game.background_image,
        price,
      });
      setInCartIds((prev) => [...prev, game.id]);
    }
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
            <div
              className="h-48 relative bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${game.background_image})` }}
            >
              <Link
                href={`/game/${game.slug}`}
                className="absolute inset-0 z-0"
              />

              <button
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  removeFavorite(game.id);
                }}
                className="absolute top-2 left-2 bg-red-600/70 hover:bg-red-700/80 w-10 h-10 rounded-full z-10 justify-center items-center flex transition-transform duration-300 transform hover:scale-110"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 21 20"
                >
                  <path
                    fill="currentColor"
                    d="M2.854 2.146a.5.5 0 1 0-.708.708l1.271 1.27a4 4 0 0 0-.156.15c-1.688 1.705-1.68 4.476.016 6.189l6.277 6.34c.26.263.682.263.942 0l2.787-2.813l3.863 3.864a.5.5 0 0 0 .708-.708zm9.722 11.137l-2.55 2.575l-6.039-6.099c-1.313-1.326-1.314-3.47-.015-4.782q.074-.075.153-.145zm3.452-3.485l-2.045 2.064l.707.707l2.05-2.07a4.41 4.41 0 0 0-.016-6.187a4.306 4.306 0 0 0-6.135-.015l-.596.603l-.605-.61l-.1-.099a4.32 4.32 0 0 0-4.035-1.06l.874.874a3.32 3.32 0 0 1 2.55.988l.961.97a.5.5 0 0 0 .711 0L11.3 5a3.306 3.306 0 0 1 4.713.016a3.41 3.41 0 0 1 .016 4.78z"
                  />
                </svg>
              </button>
            </div>

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
              <div className="space-y-4">
                <button
                  onClick={() => toggleCart(game)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {inCartIds.includes(game.id)
                    ? "Remove from Cart"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
