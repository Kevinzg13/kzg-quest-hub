import React, { createContext, useState, useEffect, useContext } from 'react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import * as bchaddr from 'bchaddrjs';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [connector, setConnector] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initConnector = () => {
      // Configuración específica para BCH (chainId 145)
      const wc = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: QRCodeModal,
        clientMeta: {
          description: 'KZG Quest Hub - Gana tokens completando misiones',
          url: 'https://kzg-quest-hub.vercel.app',
          icons: ['https://kzg-quest-hub.vercel.app/favicon.ico'],
          name: 'KZG Quest Hub'
        }
      });

      setConnector(wc);

      // Restaurar sesión existente
      if (wc.connected) {
        handleSessionUpdate(wc.session);
      }

      // Eventos críticos
      wc.on('connect', (error, payload) => {
        if (error) {
          console.error('Error de conexión:', error);
          setLoading(false);
          return;
        }
        handleSessionUpdate(payload.params[0]);
        setLoading(false);
      });

      wc.on('session_update', (error, payload) => {
        if (error) {
          console.error('Error en actualización:', error);
          return;
        }
        handleSessionUpdate(payload.params[0]);
      });

      wc.on('disconnect', () => {
        setWalletAddress(null);
        setLoading(false);
      });
    };

    initConnector();
  }, []);

  // Conversión a formato CashAddr (BCH)
  const handleSessionUpdate = (session) => {
    if (session.accounts && session.accounts.length > 0) {
      const legacyAddr = session.accounts[0].split(':')[1] || session.accounts[0];
      try {
        // Conversión a formato CashAddr (ej: bitcoincash:q...)
        const cashAddr = bchaddr.toCashAddress(legacyAddr);
        setWalletAddress(cashAddr);
      } catch (error) {
        console.error('Error en conversión de dirección:', error);
        setWalletAddress(legacyAddr);
      }
    }
  };

  // Conexión con chainId 145 (BCH Mainnet)
  const connectWallet = async () => {
    if (!connector) return;
    setLoading(true);
    try {
      if (!connector.connected) {
        await connector.createSession({ 
          chainId: 145 // ✅ CRUCIAL: 145 = BCH Mainnet
        });
      }
    } catch (error) {
      console.error('Error al conectar:', error);
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    if (connector) {
      await connector.killSession();
      setWalletAddress(null);
    }
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      connectWallet,
      disconnectWallet,
      loading,
      isConnected: !!walletAddress
    }}>
      {children}
    </WalletContext.Provider>
  );
};
