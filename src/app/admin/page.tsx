"use client";
import React, { useContext, useEffect, useState } from "react";
import { signerContext } from "../context/SignerContext";
import voting from "../../utils/voting.json";
import { ethers } from "ethers";
// import { Button, Card, Input } from "@mantine/core";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";

function Admin() {
  const [requests, setRequests] = useState<string[]>(["111111"]);
  const router = useRouter();
  const [approveLoading, setApproveLoading] = useState(false);
  const [addEligibleLoading, setAddEligibleLoading] = useState(false);
  const [addEligiblityAddr, setAddEligiblityAddr] = useState("");
  const signerValues = useContext(signerContext);
  console.log(requests);
  console.log(signerValues.signer);

  const approveRequest = async (address: string) => {
    setApproveLoading(true);
    let provider = signerValues.provider;
    let signer = signerValues.signer;
    const contract = new ethers.Contract(
      "0x5693B54c4c03aE96F2cBe7c79ac25E549Ed0E191",
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
      "0x5693B54c4c03aE96F2cBe7c79ac25E549Ed0E191",
      voting.abi,
      provider.getSigner()
    );
    const requests = await contract.getAllRequests();
    setRequests(requests);
  };
  useEffect(() => {
    // getAllRequests();
  }, []);
  if (
    !signerValues ||
    signerValues.signer != "0xb378c0d9ac3d671553a1bb6cf335184393f91f15"
  ) {
    return null;
  }
  return (
    <div className="min-h-screen ">
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
              Make Eligible
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
