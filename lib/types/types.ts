export type Player = {
  id: string;
  name: string;
  nickname: string;
};

export type Team = {
  id: string;
  player1: Player;
  player2: Player;
};

export type Round = {
  order: number;
  winningTeamId: string;
  points: number;
};

export type MatchDetail = {
  id: string;
  type: string;

  teamA: Team;
  teamB: Team;

  teamAScore: number;
  teamBScore: number;

  winningTeamId: string | null;
  status: string;

  rounds: Round[];

  teamAScores: number[];
  teamBScores: number[];
};

export type CreateMatchRequest = {
  teamAPlayer1Id: string;
  teamAPlayer2Id: string;
  teamBPlayer1Id: string;
  teamBPlayer2Id: string;
  type: "Fixed" | "Rotating";
};

export type AddRoundRequest = {
  matchId: string;
  winningTeamId: string;
  points: number;
};