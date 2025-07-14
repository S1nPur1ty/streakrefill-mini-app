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

  const { selectedCoupon } = useAppStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gray-950/80 backdrop-blur-lg">
      {/* Selected Coupon Display */}
      <div className="flex-1">
        {selectedCoupon && (
          <div className="flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 max-w-xs">
            <span className="text-sm">{selectedCoupon.icon || '🎁'}</span>
            <span className="text-primary font-semibold text-xs truncate">
              {selectedCoupon.title}
            </span>
            <span className="text-primary text-xs">
              {selectedCoupon.discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Wallet Button */}
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