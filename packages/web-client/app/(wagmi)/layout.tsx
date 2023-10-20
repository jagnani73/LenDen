"use client";

import { wagmiConfig } from "@/utils/services/wagmi";
import { UserProvider } from "@/utils/store";
import { WagmiConfig } from "wagmi";

const WagmiLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <UserProvider>{children}</UserProvider>
    </WagmiConfig>
  );
};

export default WagmiLayout;
