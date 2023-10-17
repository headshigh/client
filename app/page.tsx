"use client";
//deployed on 0x94d51524DBEEE392641CFE83690B5ecd053c92B2
import React, { useEffect, useContext } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { useState } from "react";
import { signerContext } from "./context/SignerContext";
import Navbar from "./Components/Navbar";
import voting from "../src/utils/voting.json";
import { CandidateCard } from "./Components/CandidateCard";
import { Button } from "@/components/ui/button";
export interface candidate {
  name: string;
  address: string;
  id: number;
  filename: string;
  voteCount: number;
  url: string;
}
function Page() {
  const signerValues = useContext(signerContext);
  const [candidates, setCandidates] = useState<candidate[]>();
  const [voteLoading, setVoteLoading] = useState(false);
  const [elgiblityLoading, setEligiblityLoading] = useState(false);
  const [isEligibleToVote, setIsEligibleToVote] = useState<Boolean>();
  console.log(signerValues);
  const getCandidates = async () => {
    try {
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0xe73453083D525Cd9Ac1543DD2Ee1e58184548aEb",
        voting.abi,
        provider.getSigner()
      );
      const candidates = await contract.getAllCandidates();
      const isEligibleToVote = await contract.isEligible(signerValues.signer);
      console.log(isEligibleToVote);
      setIsEligibleToVote(isEligibleToVote == true ? true : false);
      setCandidates(candidates);
    } catch (err) {
      console.log(err);
    }
  };
  const requestEligiblity = async () => {
    try {
      setEligiblityLoading(true);
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0xe73453083D525Cd9Ac1543DD2Ee1e58184548aEb",
        voting.abi,
        provider.getSigner()
      );
      await contract.requestEligiblity(signer);
      setEligiblityLoading(false);
    } catch (err) {
      setEligiblityLoading(false);
      console.log(err);
    }
  };
  console.log(isEligibleToVote);
  useEffect(() => {
    getCandidates();
    // contract.on("addCandidateEvent", () => {
    //   console.log("new candidate added");
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [1]);
  console.log(candidates);
  return (
    <div className="">
      <Navbar />
      <div className="grid px-3 pt-5 ">
        {isEligibleToVote == false && (
          <div className="flex gap-5 items-center ">
            <h1 className="text-xl">You are not eligible to vote: </h1>
            <Button
              variant="secondary"
              className=""
              onClick={() => requestEligiblity()}
            >
              {elgiblityLoading ? (
                <h1 className="animate-pulse">Loading...</h1>
              ) : (
                <h1>Request Eligiblity</h1>
              )}
            </Button>
          </div>
        )}
        <div className="flex justify-between mb-5">
          <h1 className="text-3xl font-medium ">Candidates</h1>
        </div>
        <div className="grid grid-cols-4">
          {candidates &&
            candidates.map((candidate) => (
              <CandidateCard
                isEligibleToVote={isEligibleToVote || false}
                key={candidate.id}
                candidate={candidate}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
