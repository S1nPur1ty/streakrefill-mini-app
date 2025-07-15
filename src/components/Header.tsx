import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, Tag } from "phosphor-react";
import { useEffect, useRef } from "react";
import { useAppStore } from "../stores/useAppStore";
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
  const { setWalletInfo, selectedCoupon, setActiveTab } = useAppStore();

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

  const handleCouponClick = () => {
    // When clicking on the coupon tag, return to home page
    setActiveTab('home');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gray-950/80">
      <div className="flex items-center gap-2">
        {selectedCoupon && (
          <button
            onClick={handleCouponClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-colors 
              ${selectedCoupon.type === 'discount' 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'bg-secondary/20 text-secondary border border-secondary/30'
              }`}
          >
            <Tag size={16} />
            <span className="text-sm font-semibold">
              {selectedCoupon.type === 'discount' 
                ? `${selectedCoupon.value}% OFF` 
                : `$${selectedCoupon.value} FREE`
              }
            </span>
          </button>
        )}
      </div>
      
      <div>
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
      </div>
    </header>
  );
}; 