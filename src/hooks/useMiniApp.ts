import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export const useMiniApp = () => {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const miniAppStatus = await sdk.isInMiniApp();
        setIsMiniApp(miniAppStatus);
        
        if (miniAppStatus) {
          // Mini App-specific initialization
          sdk.actions.ready();
        }
      } catch (error) {
        console.error('Error checking Mini App status:', error);
        setIsMiniApp(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMiniApp();
  }, []);

  return { isMiniApp, isLoading };
}; 