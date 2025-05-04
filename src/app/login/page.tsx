"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-zinc-900 text-gray-100 p-6 mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-zinc-800/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-700/50 shadow-lg"
      >
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          LOGIN
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4 mt-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-zinc-700/50 border border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-200 placeholder-gray-400"
            required
          />
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          <button
            type="submit"
            className="relative inline-block group px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all duration-300"
          >
            <span className="flex items-center justify-center">
              Sign In
            </span>
          </button>
        </form>

        {/* Link a Register */}
        <div className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-pink-400 hover:underline">
            Register here
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
