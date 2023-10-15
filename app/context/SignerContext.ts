import { createContext } from "react";
export interface signerContextType {
  signer: string;
  connectWallet: any;
  provider: any;
}
export const signerContext = createContext<signerContextType>({} as any);
