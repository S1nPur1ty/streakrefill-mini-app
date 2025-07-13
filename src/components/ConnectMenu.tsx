import { useAccount, useConnect } from "wagmi";
import { SignButton } from "./SignButton";

export const ConnectMenu = () => {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-6 p-6 border border-gray-700 rounded-xl bg-gray-900">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">Connected account:</h3>
          <p className="font-mono text-sm text-gray-400 break-all bg-gray-800 p-2 rounded-md">{address}</p>
        </div>
        <SignButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        type="button" 
        onClick={() => connect({ connector: connectors[0] })}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-0.5 min-w-[140px]"
      >
        Connect Wallet
      </button>
    </div>
  );
}; 