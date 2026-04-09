import {
  Player,
  MatchDetail,
} from "@/lib/types/types";
import {
  CreateMatchRequest,
  AddRoundRequest,
} from "@/lib/types/types";

const API_URL = "http://localhost:5166";

// Players
export async function getPlayers() {
  const res = await fetch(`${API_URL}/api/Players`);
  if (!res.ok) throw new Error("Failed to fetch players");

  return res.json();
}

// Matches
export async function createMatch(data: CreateMatchRequest): Promise<MatchDetail> {
  const res = await fetch(`${API_URL}/matches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create match");

  return res.json();
}

export async function getMatch(id: string): Promise<MatchDetail> {
  const res = await fetch(`${API_URL}/matches/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match");

  return res.json();
}

// Rounds
export async function addRound(data: AddRoundRequest): Promise<MatchDetail> {
  const res = await fetch(`${API_URL}/matches/rounds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add round");

  return res.json();
}