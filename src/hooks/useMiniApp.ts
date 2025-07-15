import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAppStore } from "../stores/useAppStore";

export const useMiniApp = () => {
  const { isMiniApp, isLoading, setMiniAppStatus } = useAppStore();

  useEffect(() => {
    const checkMiniApp = async () => {
      try {
        const miniAppStatus = await sdk.isInMiniApp();
        setMiniAppStatus(miniAppStatus, false);
        
        if (miniAppStatus) {
          // Mini App-specific initialization
          sdk.actions.ready();
        }
      } catch (error) {
        console.error('Error checking Mini App status:', error);
        setMiniAppStatus(false, false);
      }
    };

    checkMiniApp();
  }, [setMiniAppStatus]);

  return { isMiniApp, isLoading };
}; 