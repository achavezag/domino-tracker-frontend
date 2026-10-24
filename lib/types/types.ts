export type Player = {
  id: string;
  name: string;
  nickname: string;
  image: string | null;
};

export type SeasonPlayed = {
  id: number;
  alias: number;
};

export type Team = {
  id: string;
  player1: Player;
  player2: Player;
  seasonsPlayed: SeasonPlayed[];
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
  date: string;
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
  image?: string;
};

export type UpdatePlayerRequest = {
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
  player1Nickname: string;
  player2Id: string;
  player2Nickname: string;
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

export type MatchListItem = {
  id: string;
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  winningTeamId: string;
  status: string;
  type: string;
  finishedAt?: string;
};

export type MatchFilters = {
  fromDate?: string;
  toDate?: string;
  type?: MatchType;
  teamAId?: string;
  teamBId?: string;
  seasonIds?: number[];
};

export type Session = {
  id: number;
  name: string;
  createdAt: string;
};

export type CreateSessionRequest = {
  name: string;
};

export type Season = {
  id: number;
  alias: number;
  startDate: string;
  endDate: string | null;
};

export type CreateSeasonRequest = {
  startDate: string;
  endDate: string | null;
};

export type UpdateSeasonRequest = {
  startDate: string;
  endDate: string | null;
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

export type Role = "super_admin" | "session_admin" | "user";

export type LoginRequest = {
  username: string;
  password: string;
  role: Role;
  sessionName?: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: string;
  username: string;
  role: Role;
  sessionId: number | null;
  sessionName: string | null;
};

export type RoleOption = {
  id: number;
  name: Role;
};

export type AppUser = {
  id: number;
  username: string;
  roleId: number;
  roleName: Role;
  sessionId: number | null;
  sessionName: string | null;
};

export type CreateUserRequest = {
  username: string;
  password: string;
  roleId: number;
  sessionId: number | null;
};

export type UpdateUserRequest = {
  username: string;
  password?: string;
  roleId: number;
  sessionId: number | null;
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