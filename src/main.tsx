import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { checkEnvironment } from "./lib/checkEnv";

import "./index.css";

// Check environment variables early
console.log("Application starting...");
const envOk = checkEnvironment();

if (!envOk) {
  console.warn("⚠️ Application is running without proper environment configuration!");
  console.warn("Check the browser console for more details.");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
