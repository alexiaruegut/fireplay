import { notFound } from "next/navigation";

type Game = {
  id: number;
  name: string;
  description: string;
  background_image: string;
};

async function fetchGame(slug: string): Promise<Game | null> {
  try {
    const res = await fetch(`https://api.rawg.io/api/games/${slug}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching game detail:", error);
    return null;
  }
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await fetchGame(params.slug);

  if (!game) {
    notFound();
  }

  return (
    <section className="flex flex-1 flex-col bg-zinc-900 text-gray-100 p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {game.name}
        </h1>

        <div className="rounded-xl overflow-hidden shadow-lg mb-6">
          <img
            src={game.background_image}
            alt={game.name}
            className="object-cover w-full h-64"
          />
        </div>

        <p className="text-gray-300 leading-relaxed">{game.description ? game.description : "No description available."}</p>
      </div>
    </section>
  );
}
