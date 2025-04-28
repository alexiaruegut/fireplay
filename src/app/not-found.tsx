"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-zinc-900 text-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
          404
        </h1>
        <p className="text-2xl mb-8 text-gray-400">
          Oops! The page you are looking for does not exist.
        </p>
        <Link href="/">
          <span className="relative inline-block group">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all duration-300">
              Go back Home
            </span>
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
