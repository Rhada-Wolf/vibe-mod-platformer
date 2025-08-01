import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Platformer Game</h1>
      <div className="flex space-x-4">
        <Link href="/game" className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-colors">
          Play Game / Level Editor
        </Link>
        <Link href="/game?level=test" className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition-colors">
          Play Test Stage
        </Link>
      </div>
    </main>
  );
}
