import { useSignMessage } from "wagmi";

export const SignButton = () => {
  const { signMessage, isPending, data, error } = useSignMessage();

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md">
      <button 
        type="button" 
        onClick={() => signMessage({ message: "Sign this message to confirm you own this address." })} 
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:cursor-not-allowed min-w-[140px]"
      >
        {isPending ? "Signing..." : "Sign Message"}
      </button>
      
      {data && (
        <div className="p-4 rounded-lg w-full text-left bg-green-900/30 border border-green-500">
          <h4 className="text-base font-medium mb-2">Signature:</h4>
          <p className="font-mono text-sm break-all text-gray-300">{data}</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 rounded-lg w-full text-left bg-red-900/30 border border-red-500">
          <h4 className="text-base font-medium mb-2">Error:</h4>
          <p className="font-mono text-sm break-all text-gray-300">{error.message}</p>
        </div>
      )}
    </div>
  );
}; 