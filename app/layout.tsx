"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState, createContext } from "react";
const inter = Inter({ subsets: ["latin"] });
import { signerContext } from "./context/SignerContext";
import { ethers } from "ethers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signer, setSigner] = useState<any>();
  const [provider, setProvider] = useState<any>();
  const connectWallet = async () => {
    //@ts-expect-error
    const { ethereum } = window;
    if (ethereum) {
      //@ts-expect-error
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setSigner(accounts[0]);
      setProvider(provider);
    }
  };
  useEffect(() => {
    connectWallet();
  }, []);
  const contextValue = { signer, connectWallet, provider };

  return (
    <html lang="en">
      <body className={inter.className}>
        <signerContext.Provider value={contextValue}>
          {children}
        </signerContext.Provider>
      </body>
    </html>
  );
}
