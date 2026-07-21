"use client";
import React, { useState } from "react";
import { MatchLogTable } from "../table/MatchLogTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MatchDetailedCard } from "../MatchDetailedCard";
import { MatchLog } from "@/lib/services/matches";

interface Props {
  matches: MatchLog[];
}

export const MatchHistoryList = ({ matches }: Props) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (match: MatchLog) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMatch(null), 300);
  };

  return (
    <>
      <MatchLogTable data={matches ?? []} onSelectMatch={openModal} />
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Match Details</DialogTitle>
          </DialogHeader>
          {isModalOpen && selectedMatch && (
            <MatchDetailedCard match={selectedMatch} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
