"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="flex flex-col flex-1 bg-zinc-900 text-gray-100 min-h-screen">
      {/* Sección destacada con imagen de fondo */}
      <div className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-photo/illustration-rain-futuristic-city_23-2151406573.jpg?t=st=1745351542~exp=1745355142~hmac=25afaa2a09778cca4544f234da29e1077afa46a12348c238540e068953a2e207&w=900')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/60 to-zinc-900 backdrop-blur-sm" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto px-15 text-center"
        >
          <div className="backdrop-blur-md bg-zinc-800/50 p-8 rounded-3xl border border-zinc-700/50 shadow-lg">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl transform rotate-12 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a9.98 9.98 0 0 1 7.743 3.671L13.414 12l6.329 6.329A9.98 9.98 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 4.697 14.477l.208-.157l-6.32-6.32l6.32-6.321l-.208-.156a7.97 7.97 0 0 0-4.394-1.517zm0 1a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Welcome to Fireplay
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover a universe of games. Play, explore, and conquer with
              Fireplay.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a href="/games" className="relative inline-block group">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-full transition-all duration-300">
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M8 18.392V5.608L18.226 12zM6 3.804v16.392a1 1 0 0 0 1.53.848l13.113-8.196a1 1 0 0 0 0-1.696L7.53 2.956A1 1 0 0 0 6 3.804"
                      />
                    </svg>
                    Discover Games
                  </span>
                </span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ¿Qué es Fireplay? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto my-16 p-4 text-center"
      >
        <div className="backdrop-blur-md bg-zinc-800/50 p-8 rounded-3xl border border-zinc-700/50 shadow-md relative overflow-hidden">
          {/* Elementos decorativos de videojuegos */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-purple-500/20 rounded-full opacity-50"></div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-pink-500/20 rounded-full opacity-50"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              What is Fireplay?
            </h2>
            <p className="text-gray-300 mb-4">
              Fireplay is your next-generation platform to discover and buy the
              best games — from action and adventure to strategy and beyond.
              Explore our catalog and save your favorites.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/about"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center"
              >
                <span>More Information</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href="/contact"
                className="text-pink-400 hover:text-pink-300 transition-colors flex items-center"
              >
                <span>Contact Us</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cómo funciona */}
      <div className="py-16 bg-zinc-800">
        <div className="max-w-5xl mx-auto text-center p-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
          >
            <span>How Fireplay Works</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "1. Explore",
                description: "Browse hundreds of available games and discover new favorites.",
                delay: 0.3,
                gradient: "from-blue-500 to-indigo-600",
                bgColor: "bg-zinc-700/50",
                borderColor: "border-zinc-600/50",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m18.031 16.617l4.283 4.282l-1.415 1.415l-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9s9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617m-2.006-.742A6.98 6.98 0 0 0 18 11c0-3.867-3.133-7-7-7s-7 3.133-7 7s3.133 7 7 7a6.98 6.98 0 0 0 4.875-1.975z"
                    />
                  </svg>
                ),
              },
              {
                title: "2. Save Your Favorites",
                description:
                  "Add games to your wishlist or cart for easy access later.",
                delay: 0.5,
                gradient: "from-purple-500 to-indigo-600",
                bgColor: "bg-zinc-700/50",
                borderColor: "border-zinc-600/50",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12.001 4.529a6 6 0 0 1 8.242.228a6 6 0 0 1 .236 8.236l-8.48 8.492l-8.478-8.492a6 6 0 0 1 8.48-8.464m6.826 1.641a4 4 0 0 0-5.49-.153l-1.335 1.198l-1.336-1.197a4 4 0 0 0-5.686 5.605L12 18.654l7.02-7.03a4 4 0 0 0-.193-5.454"
                    />
                  </svg>
                ),
              },
              {
                title: "3. Enjoy",
                description: "Purchase your favorite games and dive into new adventures.",
                delay: 0.7,
                gradient: "from-pink-500 to-purple-600",
                bgColor: "bg-zinc-700/50",
                borderColor: "border-zinc-600/50",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M17 4a6 6 0 0 1 6 6v4a6 6 0 0 1-6 6H7a6 6 0 0 1-6-6v-4a6 6 0 0 1 6-6zm0 2H7a4 4 0 0 0-3.995 3.8L3 10v4a4 4 0 0 0 3.8 3.995L7 18h10a4 4 0 0 0 3.995-3.8L21 14v-4a4 4 0 0 0-3.8-3.995zm-7 3v2h2v2H9.999L10 15H8l-.001-2H6v-2h2V9zm8 4v2h-2v-2zm-2-4v2h-2V9z"
                    />
                  </svg>
                ),
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: step.delay }}
                className={`backdrop-blur-sm ${step.bgColor} p-6 rounded-3xl border ${step.borderColor} shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Efecto de brillo al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${step.gradient} text-white transform rotate-6 shadow-md`}
                >
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Llamada a la acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center py-16 px-4 bg-zinc-900 relative overflow-hidden"
      >
        {/* Elementos decorativos de videojuegos */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/free-photo/illustration-rain-futuristic-city_23-2151406573.jpg?t=st=1745351542~exp=1745355142~hmac=25afaa2a09778cca4544f234da29e1077afa46a12348c238540e068953a2e207&w=900')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/60 to-zinc-900 backdrop-blur-sm" />
        </div>

        <div className="backdrop-blur-md bg-zinc-800/50 p-8 rounded-3xl border border-zinc-700/50 shadow-xl max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Ready to Play?
          </h2>
          <a href="/games" className="relative inline-block group">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative inline-block px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold rounded-full transition-all duration-300">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M8 18.392V5.608L18.226 12zM6 3.804v16.392a1 1 0 0 0 1.53.848l13.113-8.196a1 1 0 0 0 0-1.696L7.53 2.956A1 1 0 0 0 6 3.804"
                  />
                </svg>
                Explore Games
              </span>
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
