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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end p-4 bg-gray-950/80">
      <button
        onClick={handleWalletClick}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-primary/20 text-white hover:text-primary rounded-full font-medium transition-colors border border-white/10 hover:border-primary/30"
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