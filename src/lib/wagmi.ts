"use client";

import { http, createStorage, cookieStorage } from "wagmi";
import { polygon } from "wagmi/chains";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "9497f7be49f92c5f565bb3bf26ed3205";

const supportedChains: Chain[] = [polygon];

export const config = getDefaultConfig({
  appName: "Throu",
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {}
  ),
});
