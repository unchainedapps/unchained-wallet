import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Unchained Wallet",
    short_name: "Wallet",
    description:
      "Free, open-source personal finance app. Track spending, manage budgets, and understand where your money goes.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4ED",
    theme_color: "#20201F",
    orientation: "portrait-primary",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/unchained-wallet-matching-chain-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/unchained-wallet-matching-chain-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
