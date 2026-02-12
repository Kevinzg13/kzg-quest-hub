import Head from 'next/head';
import Link from 'next/link';
import ConnectWallet from '../components/ConnectWallet';
import QuestCard from '../components/QuestCard';

export default function Home() {
  return (
    <>
      <Head>
        <title>KZG Quest Hub | Gana tokens completando misiones</title>
        <meta name="description" content="Plataforma de gamificación para ganar tokens KZG en la red BCH" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        {/* Header */}
        <header className="py-6 px-8 flex justify-between items-center border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center font-bold text-white">
              KZG
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Quest Hub
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6">
              <Link href="/quests" className="text-purple-200 hover:text-white transition">Misiones</Link>
              <Link href="/leaderboard" className="text-purple-200 hover:text-white transition">Leaderboard</Link>
              <Link href="/rewards" className="text-purple-200 hover:text-white transition">Recompensas</Link>
            </nav>
            <ConnectWallet />
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
              Gana <span className="text-yellow-400">KZG</span> Tokens
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-10">
              Completa misiones diarias, trivia y desafíos para acumular tokens KZG en la red Bitcoin Cash
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/quests" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-bold text-white shadow-lg hover:shadow-purple-500/50 transition">
                Empezar Quests
              </Link>
              <Link href="/about" className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full font-bold text-white backdrop-blur-sm transition">
                Cómo Funciona
              </Link>
            </div>
          </div>

          {/* Featured Quests */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <QuestCard
              title="Trivia Diaria"
              description="Responde 5 preguntas y gana hasta 50 KZG"
              reward="50 KZG"
              difficulty="Fácil"
              time="2 min"
            />
            <QuestCard
              title="Misión Social"
              description="Sigue en Twitter y únete al Discord"
              reward="100 KZG"
              difficulty="Medio"
              time="5 min"
            />
            <QuestCard
              title="Referidos"
              description="Invita amigos y gana comisión del 10%"
              reward="50 KZG + 10%"
              difficulty="Fácil"
              time="Ilimitado"
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-8 text-center text-purple-300 border-t border-purple-500/20 mt-16">
          <p>© 2026 KZG Quest Hub - Powered by Bitcoin Cash</p>
        </footer>
      </div>
    </>
  );
}
