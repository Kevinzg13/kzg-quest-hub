import React from 'react';
import { useWallet } from '../context/WalletContext';

const ConnectWallet = () => {
  const { walletAddress, connectWallet, disconnectWallet, loading, isConnected } = useWallet();

  // Formato de dirección BCH (ej: bitcoincash:q...)
  const formatAddress = (addr) => {
    if (!addr) return '';
    const cleanAddr = addr.replace('bitcoincash:', '');
    return `${cleanAddr.slice(0, 6)}...${cleanAddr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-green-400 font-mono text-sm">
          {formatAddress(walletAddress)}
        </span>
        <button
          onClick={disconnectWallet}
          className="ml-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition text-red-300"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={loading}
      className={`px-5 py-2.5 rounded-full font-medium transition-all ${
        loading 
          ? 'bg-purple-400 cursor-wait' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
      } text-white shadow-lg hover:shadow-purple-500/30`}
    >
      {loading ? 'Conectando...' : '🔌 Conectar Wallet'}
    </button>
  );
};

export default ConnectWallet;
