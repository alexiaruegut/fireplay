"use client";

export default function AboutPage() {
  return (
    <section className="flex flex-1 bg-zinc-900 text-white p-6 flex items-center justify-center mt-15">
      <div className="w-full max-w-4xl bg-zinc-800/60 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-zinc-700 space-y-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center">
          About Fireplay
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          <strong>Fireplay</strong> is a modern digital game store designed for
          gamers, by gamers. We aim to provide a seamless experience to browse,
          discover, and buy your favorite PC games. Whether you&apos;re into
          action-packed adventures, deep role-playing worlds, or indie hidden
          gems — Fireplay is your new home.
        </p>

        <h2 className="text-2xl font-semibold text-pink-400">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Curated catalog of top-rated and trending video games</li>
          <li>Instant checkout and secure payment processing</li>
          <li>
            User accounts with wishlists, purchase history, and cart syncing
          </li>
          <li>
            Favorites system so you never lose track of your most-loved games
          </li>
          <li>Real-time search with instant game previews</li>
        </ul>

        <h2 className="text-2xl font-semibold text-purple-400">
          How Fireplay Works
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Users can sign up for free and begin adding games to their favorites
          or cart. Once you&apos;re ready, proceed to checkout and instantly
          finalize your order. Every purchase is stored securely under your
          account, and you can revisit your full purchase history at any time
          from your dashboard.
        </p>

        <h2 className="text-2xl font-semibold text-pink-400">Our Mission</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          We built Fireplay to make game shopping fast, fun, and user-friendly.
          No ads, no clutter — just clean access to the titles you care about.
          Our mission is to support both players and developers by creating a
          platform that’s fair, transparent, and enjoyable to use.
        </p>

        <h2 className="text-2xl font-semibold text-purple-400">Need Help?</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Have questions or need support? Visit our{" "}
          <a
            href="/contact"
            className="text-pink-400 underline hover:text-pink-300"
          >
            Contact page
          </a>{" "}
          to reach out. We&apos;re here to help!
        </p>

        <p className="text-center text-gray-500 text-sm mt-10">
          &copy; {new Date().getFullYear()} Fireplay. All rights reserved.
        </p>
      </div>
    </section>
  );
}
