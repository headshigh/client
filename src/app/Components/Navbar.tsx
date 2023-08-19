"use client";
import React from "react";
import { useContext } from "react";
import { signerContext } from "../context/SignerContext";
import Link from "next/link";
import Image from "next/image";

function Navbar() {
  const signer = useContext(signerContext);
  console.log(signer.signer);
  return (
    <div>
      <div className="flex justify-between py-4 items-center border-b border-slate-700">
        <Link href="/">Voote</Link>
        {signer ? (
          <div>
            <Image
              className="rounded"
              width={30}
              height={30}
              alt="profile"
              src={`https://effigy.im/a/${signer.signer}.svg`}
            />
          </div>
        ) : (
          <h1 onClick={() => signer.connectWallet()}>Connect wallet</h1>
        )}
      </div>
    </div>
  );
}

export default Navbar;
