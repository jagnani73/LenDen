"use client";

import { wagmiConfig } from "@/utils/services/wagmi";
import { AuthTokenProvider } from "@/utils/store";
import { WagmiConfig } from "wagmi";

const WagmiLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <AuthTokenProvider>{children}</AuthTokenProvider>
    </WagmiConfig>
  );
};

export default WagmiLayout;
