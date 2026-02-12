import React from 'react';
import Link from 'next/link';

const QuestCard = ({ title, description, reward, difficulty, time }) => {
  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'fácil': return 'bg-green-500/20 text-green-400';
      case 'medio': return 'bg-yellow-500/20 text-yellow-400';
      case 'difícil': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>
      
      <p className="text-purple-200 mb-4">{description}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">💰</span>
          <span className="text-white font-bold">{reward}</span>
        </div>
        <div className="flex items-center gap-2 text-purple-300">
          <span>⏱️</span>
          <span className="text-sm">{time}</span>
        </div>
      </div>
      
      <Link 
        href="/quests" 
        className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-2 rounded-lg font-medium transition"
      >
        Iniciar Misión
      </Link>
    </div>
  );
};

export default QuestCard;
