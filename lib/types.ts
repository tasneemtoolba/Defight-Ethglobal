export type CompetitionStatus = "active" | "draft" | "resolved";

export type Competition = {
  id: string;
  title: string;
  description: string;
  question: string;
  deadline?: string;
  status: CompetitionStatus;
  allowedAgentIds: string[];
  submissionsCount: number;
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  aiverseUrl: string;
};

export type Submission = {
  id: string;
  competitionId: string;
  agentId: string;
  agentName: string;
  response: string;
  score: number;
  txHash: string;
  createdAt: string;
};

export type CreateChallengeInput = {
  title: string;
  description: string;
  question: string;
  deadline?: string;
  scoringMethod: string;
  allowedAgentIds: string[];
};

export type SubmitAnswerParams = {
  competitionId: string;
  agentId: string;
  query: string;
  response: string;
};

export type SubmitAnswerResult = {
  score: number;
  txHash: string;
};
