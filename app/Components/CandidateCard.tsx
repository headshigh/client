"use client";
import { signerContext } from "../context/SignerContext";
import { useContext } from "react";
import voting from "../../src/utils/voting.json";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { ipfsToHTTPS } from "@/helper";
import { Card, Image, Text, Group, Badge, Center, rem } from "@mantine/core";
import { createStyles } from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";
import { candidate } from "../page";
import { useEffect, useState } from "react";
const useStyles = createStyles((theme: any) => ({
  card: {
    backgroundColor: "black",
    maxWidth: "400px",
    border: `${rem(2)} solid #111827`,
  },
  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `${rem(1)} solid #111827`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: rem(-0.25),
    textTransform: "uppercase",
  },
  section: {
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid #111827`,
  },
  icon: {
    marginRight: rem(5),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));
interface meta {
  name: string;
  description: string;
  imageURL: string;
}
export function CandidateCard({
  candidate,
  isEligibleToVote,
}: {
  candidate: candidate;
  isEligibleToVote: Boolean;
}) {
  const [meta, setMeta] = useState<meta>();
  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataResponse = await fetch(ipfsToHTTPS(candidate.url));
      if (metadataResponse.status != 200) return;
      const json = await metadataResponse.json();
      setMeta({
        name: json.name,
        description: json.description,
        imageURL: ipfsToHTTPS(json.image),
      });
    };
    void fetchMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { classes } = useStyles();
  const [voteLoading, setVoteLoading] = useState(false);
  const signerValues = useContext(signerContext);
  const vote = async (candidateId: number) => {
    try {
      setVoteLoading(true);
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0xe73453083D525Cd9Ac1543DD2Ee1e58184548aEb",
        voting.abi,
        provider.getSigner()
      );
      await contract.vote(candidateId);
      setVoteLoading(false);
    } catch (err: any) {
      if (err.message.includes("revert")) {
        alert("Voter has already voted");
      }
      setVoteLoading(false);
    }
  };
  return (
    //
    <Card radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image
          className="h-1/2 max-w-full  object-cover"
          src={meta?.imageURL}
          alt="Tesla Model S"
        />
      </Card.Section>
      <Card.Section className={classes.section}>
        <Text fz="lg" c="dimmed" className={classes.label}>
          {candidate.name}
        </Text>
      </Card.Section>
      <Card.Section className={classes.section}>
        <Text fz="sm" c="dimmed" className={classes.label}>
          Votes:{Number(candidate.voteCount)}
        </Text>
      </Card.Section>
      <Card.Section className={classes.section}>
        <Group spacing={30}>
          <Button
            disabled={!isEligibleToVote}
            variant="secondary"
            onClick={() => vote(candidate.id)}
            style={{ flex: 1 }}
          >
            {!voteLoading ? (
              <h1> Vote Now</h1>
            ) : (
              <h1 className="animate-pulse">Loading...</h1>
            )}
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
