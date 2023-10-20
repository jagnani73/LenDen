"use client";

import { wagmiConfig } from "@/utils/services/wagmi";
import { WagmiConfig } from "wagmi";

const WagmiLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default WagmiLayout;
