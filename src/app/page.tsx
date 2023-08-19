"use client";

//deployed on 0x94d51524DBEEE392641CFE83690B5ecd053c92B2
import React, { useEffect, useContext } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { useState } from "react";
import { signerContext } from "./context/SignerContext";
import Navbar from "./Components/Navbar";
import voting from "../utils/voting.json";
import { CandidateCard } from "./Components/CandidateCard";
import { Button, TextInput } from "@mantine/core";
export interface candidate {
  name: string;
  address: string;
  id: number;
  voteCount: number;
}
function Page() {
  const signerValues = useContext(signerContext);
  const [candidates, setCandidates] = useState<candidate[]>();
  const [voteLoading, setVoteLoading] = useState(false);
  const [elgiblityLoading, setEligiblityLoading] = useState(false);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [isEligibleToVote, setIsEligibleToVote] = useState<Boolean>();
  console.log(signerValues);
  const createCandidate = async (address: string, name: string) => {
    const { ethereum } = window;
    if (ethereum) {
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0x5693B54c4c03aE96F2cBe7c79ac25E549Ed0E191",
        voting.abi,
        provider.getSigner()
      );
      await contract.addCandidate(address, name);
      contract.on("addCandidateEvent", (recipient, canId) => {
        console.log(canId, "has been added as a new candidate");
      });
    }
  };
  const getCandidates = async () => {
    try {
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0x5693B54c4c03aE96F2cBe7c79ac25E549Ed0E191",
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
        "0x5693B54c4c03aE96F2cBe7c79ac25E549Ed0E191",
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
  }, []);
  return (
    <div className="">
      <Navbar />
      <div className="grid px-3">
        <div className="flex justify-between mb-5">
          {isEligibleToVote == false && (
            <div>
              You are not eligible to vote:{" "}
              <Button
                onClick={() => requestEligiblity()}
                className="bg-indigo-600 hover:bg-indigo-500"
              >
                {elgiblityLoading ? (
                  <h1 className="animate-pulse">Loading...</h1>
                ) : (
                  <h1>Request Eligiblity</h1>
                )}
              </Button>
            </div>
          )}
          <h1 className="text-3xl font-medium ">Candidates</h1>
          <div className="flex gap-6">
            <TextInput
              onChange={(e) => setCandidateName(e.target.value)}
              value={candidateName}
              placeholder="Candidate name"
            />
            <TextInput
              onChange={(e) => setCandidateAddress(e.target.value)}
              value={candidateAddress}
              placeholder="Candidate Address"
            />
            <button
              className="bg-white hover:bg-slate-100 font-medium text-black  rounded px-4 "
              onClick={async () => {
                try {
                  setCandidateAddress("");
                  setCandidateLoading(true);
                  setCandidateName("");
                  await createCandidate(candidateAddress, candidateName);
                  setCandidateLoading(false);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              {!candidateLoading ? (
                <h1>Add Candidate</h1>
              ) : (
                <h1 className="animate-pulse">Loading...</h1>
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4">
          {candidates &&
            candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
