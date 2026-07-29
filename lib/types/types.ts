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

export type MatchDetail = {
  id: string;
  type: string;

  teamA: Team;
  teamB: Team;

  teamAScore: number;
  teamBScore: number;

  winningTeamId: string | null;
  status: string;
};

export type MatchType = "Fixed" | "Rotating";

export type CreateMatchRequest = {
  teamAId: string;
  teamBId: string;
  type: MatchType;
  teamAScore: number;
  teamBScore: number;
};

export type PlayerStats = {
  playerId: string;
  name: string;
  nickname: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  fixedMatches: number;
  fixedWins: number;
  fixedLosses: number;
  fixedMatchesWinRate: number;
  rotatingMatches: number;
  rotatingWins: number;
  rotatingLosses: number;
  rotatingMatchesWinRate: number;
  warsPlayed: number;
  warWins: number;
  warLosses: number;
  warWinRate: number;
};

export type CreatePlayerRequest = {
  name: string;
  nickname: string;
};

export type CreateTeamRequest = {
  player1Id: string;
  player2Id: string;
};

export type TeamStats = {
  teamId: string;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  fixedMatches: number;
  fixedWins: number;
  fixedLosses: number;  
  rotatingMatches: number;
  warsPlayed: number;
  warWins: number;
  warLosses: number;
  warWinRate: number;
};

export type MatchListItem = {
  id: string;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  winningTeamId: string;
  status: string;
  type: string;
  createdAt: string;
  finishedAt?: string;
};

export type MatchFilters = {
  fromDate?: string;
  toDate?: string;
  type?: MatchType;
  teamAId?: string;
  teamBId?: string;
};

export type WarListItem = {
  id: string;
  date: string;
  teamAName: string;
  teamBName: string;
};

export type WarDetail = {
  id: string;
  date: string;
  teamAName: string;
  teamBName: string;
  winningTeamId?: string;
  matches: MatchListItem[];
};

export type MatchHistoryItem = {
  id: string;
  teamAId: string;
  teamBId: string;
  teamAScore: number;
  teamBScore: number;
  finishedAt?: string;
};

export type HeadToHeadStats = {
  player1Id: string;
  player2Id: string;

  matchesPlayed: number;

  player1Wins: number;
  player2Wins: number;

  player1WarMatchWins: number;
  player2WarMatchWins: number;

  player1WarWins: number;
  player2WarWins: number;
};