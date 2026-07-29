import {
  CreatePlayerRequest,
  CreateTeamRequest,
  MatchDetail,
  MatchFilters,
  MatchListItem,
  PlayerStats,
  TeamStats,
} from '@/lib/types/types';
import { CreateMatchRequest } from '@/lib/types/types';

const API_URL = "http://localhost:5166";

// Players
export async function getPlayers() {
  const res = await fetch(`${API_URL}/api/Players`);
  if (!res.ok) throw new Error("Failed to fetch players");

  return res.json();
};

// Teams
export async function getTeams() {
  const res = await fetch(`${API_URL}/api/Teams`);
  if (!res.ok) throw new Error("Failed to get teams");

  return res.json();
};

// Matches
export async function createMatch(data: CreateMatchRequest): Promise<MatchDetail> {
  const res = await fetch(`${API_URL}/api/Matches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create match");

  return res.json();
};

export async function getMatch(matchId: string): Promise<MatchDetail> {
  const res = await fetch(`${API_URL}/api/Matches/${matchId}`);
  if (!res.ok) throw new Error("Failed to fetch match");

  return res.json();
};

// PointsMatch
export async function finishMatch(
  matchId: string,
  data: {
    teamAScore: number;
    teamBScore: number;
  }
): Promise<MatchDetail> {
  const res = await fetch(`${API_URL}/api/Matches/${matchId}/finish`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Failed to finish match";

    try {
      const data = await res.json();
      message = data.message || data.title || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}

// Players stats
export async function getPlayersStats(): Promise<PlayerStats[]> {
  const res = await fetch(`${API_URL}/api/Players/stats`);
  if (!res.ok) throw new Error("Failed to get player stats");

  return res.json();
};

// Create player
export async function createPlayer(data: CreatePlayerRequest) {
  const res = await fetch(`${API_URL}/api/Players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error creating player");

  return res.json();
};

// Create team
export async function createTeam(data: CreateTeamRequest) {
  const res = await fetch(`${API_URL}/api/Teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error creating team");

  return res.json();
};

// Teams stats
export async function getTeamsStats(): Promise<TeamStats[]> {
  const res = await fetch(`${API_URL}/api/Teams/stats`);
  if (!res.ok) throw new Error("Failed to get teams stats");

  return res.json();
};

// Matches
export async function getMatches(filters: MatchFilters): Promise<MatchListItem[]> {
  const params = new URLSearchParams();

  if (filters?.fromDate) params.append("fromDate", filters.fromDate);
  if (filters?.toDate) params.append("toDate", filters.toDate);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.teamAId) params.append("teamAId", filters.teamAId);
  if (filters?.teamBId) params.append("teamBId", filters.teamBId);

  const res = await fetch(`${API_URL}/api/Matches?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch matches");

  return res.json();
};

export async function getWars() {
  const res = await fetch(`${API_URL}/api/wars`);
  if (!res.ok) throw new Error("Error fetching wars");
  return res.json();
}

export async function getWarById(id: string) {
  const res = await fetch(`${API_URL}/api/wars/${id}`);
  if (!res.ok) throw new Error("Error fetching war detail");
  return res.json();
}

export async function createTodayWar() {
  const res = await fetch(`${API_URL}/api/wars/today`, {
    method: "POST",
  });

  if (!res.ok) {
    let message = "Error creando guerra";

    try {
      const data = await res.json();
      message = data.message || data.title || message;
    } catch {
      // fallback si no viene JSON
    }

    throw new Error(message);
  }
};

export async function getMatchHistory(teamAId: string, teamBId: string, type: "Fixed" | "Rotating") {
  const res = await fetch(
    `${API_URL}/api/wars/history?teamAId=${teamAId}&teamBId=${teamBId}&type=${type}`
  );

  if (!res.ok) throw new Error("Error fetching match history");

  return res.json();
}

export async function createWar(matchIds: string[]) {
  const res = await fetch(`${API_URL}/api/wars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ matchIds }),
  });

  if (!res.ok) {
    let message = "Error creando guerra";

    try {
      const data = await res.json();
      message = data.message || data.title || message;
    } catch {}

    throw new Error(message);
  }
};

export async function getHeadToHead(player1Id: string,player2Id: string) {
  const res = await fetch(
    `${API_URL}/api/Players/headtohead?player1Id=${player1Id}&player2Id=${player2Id}`
  );

  if (!res.ok) {
    throw new Error("Error obteniendo cara a cara");
  }

  return res.json();
}