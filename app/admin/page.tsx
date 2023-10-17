"use client";
import React, { useContext, useEffect, useState } from "react";
import { signerContext } from "../context/SignerContext";
import voting from "../../src/utils/voting.json";
import { ethers } from "ethers";
// import { Button, Card, Input } from "@mantine/core";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import Navbar from "../Components/Navbar";

function Admin() {
  const [requests, setRequests] = useState<string[]>();
  const router = useRouter();
  const [candidateName, setCandidateName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [addEligibleLoading, setAddEligibleLoading] = useState(false);
  const [addEligiblityAddr, setAddEligiblityAddr] = useState("");
  const signerValues = useContext(signerContext);
  console.log(requests);
  console.log(signerValues.signer);
  console.log(file);
  const approveRequest = async (address: string) => {
    setApproveLoading(true);
    let provider = signerValues.provider;
    let signer = signerValues.signer;
    const contract = new ethers.Contract(
      "0xe73453083D525Cd9Ac1543DD2Ee1e58184548aEb",
      voting.abi,
      provider.getSigner()
    );
    await contract.allowToVote(address);
    setApproveLoading(false);
  };
  const getAllRequests = async () => {
    let provider = signerValues.provider;
    let signer = signerValues.signer;
    const contract = new ethers.Contract(
      "0xe73453083D525Cd9Ac1543DD2Ee1e58184548aEb",
      voting.abi,
      provider.getSigner()
    );
    const requests = await contract.getAllRequests();
    setRequests(requests);
  };
  const createCandidate = async (address: string, name: string) => {
    if (!file) return;
    setCandidateAddress("");
    setCandidateLoading(true);
    setCandidateName("");
    //@ts-expect-error
    const { ethereum } = window;
    if (ethereum) {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", "description");
      formdata.append("file", file || "");
      console.log(file.name);
      formdata.append("filename", file.name);
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0xe73453083D525Cd9Ac1543DD2Ee1e58184548aEb",
        voting.abi,
        provider.getSigner()
      );
      const res = await axios.post(
        "http://localhost:3000/api/hello",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("res", res);
      await contract.addCandidate(address, name, res.data.uri.url, file.name);
      contract.on("addCandidateEvent", (recipient, canId) => {
        console.log(canId, "has been added as a new candidate");
      });
      setCandidateLoading(false);
      setFile(undefined);
    }
  };
  useEffect(() => {
    getAllRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (
    !signerValues ||
    signerValues.signer != "0xb378c0d9ac3d671553a1bb6cf335184393f91f15"
  ) {
    return null;
  }
  return (
    <div className="min-h-screen ">
      <Navbar />
      <Card className="dark bg-black w-full">
        <CardHeader>
          <CardTitle>Add Eligible Voter</CardTitle>
          <CardDescription>
            Only accounts marked as eligible are allowed to vote
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Voter address"
              value={addEligiblityAddr}
              onChange={(e) => setAddEligiblityAddr(e.target.value)}
            />
            <Button
              onClick={() => {
                if (addEligiblityAddr == "") {
                  return;
                }
                setAddEligibleLoading(true);
                approveRequest(addEligiblityAddr);
                setAddEligibleLoading(false);
                setAddEligiblityAddr("");
              }}
              variant="secondary"
              className="shrink-0"
            >
              {!addEligibleLoading ? (
                <h1>Make Eligible</h1>
              ) : (
                <h1 className="animate-pulse">Loading..</h1>
              )}
            </Button>
          </div>
          <Separator className="my-4" />
          <div className=" flex flex-col gap-2 pb-6 pt-6">
            <CardTitle>Add Candidate</CardTitle>
            <CardDescription className="">
              Voters can view candidates and cast votes
            </CardDescription>
          </div>
          <div className="flex gap-6">
            <Input
              onChange={(e) => setCandidateName(e.target.value)}
              value={candidateName}
              placeholder="Candidate name"
            />
            <Input
              onChange={(e) => setCandidateAddress(e.target.value)}
              value={candidateAddress}
              placeholder="Candidate Address"
            />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                //@ts-expect-error
                onChange={(e) => setFile(e.target.files[0])}
                id="picture"
                type="file"
              />
            </div>
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={async () => {
                try {
                  await createCandidate(candidateAddress, candidateName);
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
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Requests for Eligiblity</h4>
            <div className="grid gap-6">
              {
                <div className="flex items-center justify-between space-x-4">
                  {requests?.length == 0 && (
                    <h1 className="px-2 text-sm">No Requests to display</h1>
                  )}
                  {requests?.map((request) => (
                    <div key={request} className="flex items-center  gap-10">
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {request}
                        </p>
                      </div>
                      <Button
                        onClick={() => approveRequest(request)}
                        variant="secondary"
                        className="shrink-0"
                      >
                        {!approveLoading ? (
                          <h1>Approve</h1>
                        ) : (
                          <h1 className="animate-pulse">Loading...</h1>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Admin;
