import { createConfig, configureChains } from "wagmi";
import { avalancheFuji, polygonMumbai } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji, polygonMumbai],
  [publicProvider()]
);

const metamaskConnector = new MetaMaskConnector({
  chains: chains,
  options: {
    shimDisconnect: true,
    UNSTABLE_shimOnConnectSelectAccount: false,
  },
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [metamaskConnector],
});
