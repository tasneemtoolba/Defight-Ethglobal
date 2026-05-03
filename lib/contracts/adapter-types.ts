import type {
  Competition,
  CreateChallengeInput,
  Submission,
  SubmitAnswerParams,
  SubmitAnswerResult,
} from "@/lib/types";

export type DefightAdapter = {
  getPrompt: (competitionId: string) => Promise<string>;
  submitAnswer: (params: SubmitAnswerParams) => Promise<SubmitAnswerResult>;
  getLeaderboard: (competitionId?: string) => Promise<Submission[]>;
  createChallenge: (input: CreateChallengeInput) => Promise<Competition>;
};
