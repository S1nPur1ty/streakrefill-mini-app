import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet } from "phosphor-react";
import { useEffect, useRef } from "react";
import { useAppStore } from "../stores";
// @ts-ignore
import blockies from "ethereum-blockies";

const BlockieAvatar = ({ address }: { address: string }) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (avatarRef.current && address) {
      const icon = blockies.create({
        seed: address.toLowerCase(),
        size: 4,
        scale: 4,
      });
      
      avatarRef.current.innerHTML = '';
      avatarRef.current.appendChild(icon);
    }
  }, [address]);

  return (
    <div 
      ref={avatarRef} 
      className="w-4 h-4 rounded-lg overflow-hidden"
    />
  );
};

export const Header = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { setWalletInfo } = useAppStore();

  // Sync wallet state with Zustand store
  useEffect(() => {
    setWalletInfo(isConnected, address || undefined);
  }, [isConnected, address, setWalletInfo]);

  const handleWalletClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <header className="flex items-center justify-end p-4">
      <button
        onClick={handleWalletClick}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors"
      >
        {isConnected ? (
          <>
            <BlockieAvatar address={address || ''} />
            <span className="text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </>
        ) : (
          <>
            <Wallet size={20} />
            <span className="text-sm">Connect</span>
          </>
        )}
      </button>
    </header>
  );
}; 