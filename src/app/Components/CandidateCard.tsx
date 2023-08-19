"use client";
import { signerContext } from "../context/SignerContext";
import { useContext } from "react";
import voting from "../../utils/voting.json";
import { ethers } from "ethers";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Button,
  rem,
} from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons-react";
import { candidate } from "../page";
import { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
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

export function CandidateCard({ candidate }: { candidate: candidate }) {
  const { classes } = useStyles();
  const [voteLoading, setVoteLoading] = useState(false);
  const signerValues = useContext(signerContext);
  const vote = async (candidateId: number) => {
    try {
      setVoteLoading(true);
      let provider = signerValues.provider;
      let signer = signerValues.signer;
      const contract = new ethers.Contract(
        "0x5693B54c4c03aE96F2cBe7c79ac25E549Ed0E191",
        voting.abi,
        provider.getSigner()
      );
      await contract.vote(candidateId);
      setVoteLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Card radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src="https://i.imgur.com/ZL52Q2D.png" alt="Tesla Model S" />
      </Card.Section>
      <Card.Section className={classes.section}>
        <Text fz="sm" c="dimmed" className={classes.label}>
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
          <button
            className="bg-white hover:bg-slate-100 font-medium text-black  rounded px-4 py-2 "
            onClick={() => vote(candidate.id)}
            style={{ flex: 1 }}
          >
            {!voteLoading ? (
              <h1> Vote Now</h1>
            ) : (
              <h1 className="animate-pulse">Loading...</h1>
            )}
          </button>
        </Group>
      </Card.Section>
    </Card>
  );
}
