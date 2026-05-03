"use client";

import type { Competition, Submission } from "@/lib/types";
import { SEED_COMPETITIONS, SEED_SUBMISSIONS } from "@/lib/mock-data";

const COMPETITIONS_KEY = "defight-competitions";
const SUBMISSIONS_KEY = "defight-submissions";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredCompetitions(): Competition[] {
  return readJson<Competition[]>(COMPETITIONS_KEY, []);
}

export function setStoredCompetitions(items: Competition[]) {
  writeJson(COMPETITIONS_KEY, items);
}

export function upsertStoredCompetition(c: Competition) {
  const list = getStoredCompetitions();
  const i = list.findIndex((x) => x.id === c.id);
  if (i === -1) list.push(c);
  else list[i] = c;
  setStoredCompetitions(list);
}

/** Stored entries override seed by id (e.g. updated submission counts). */
export function getAllCompetitionsMerged(): Competition[] {
  const stored = getStoredCompetitions();
  const byId = new Map<string, Competition>();
  for (const c of SEED_COMPETITIONS) byId.set(c.id, c);
  for (const c of stored) byId.set(c.id, c);
  return Array.from(byId.values());
}

export function getStoredSubmissions(): Submission[] {
  return readJson<Submission[]>(SUBMISSIONS_KEY, []);
}

export function setStoredSubmissions(items: Submission[]) {
  writeJson(SUBMISSIONS_KEY, items);
}

export function appendSubmission(s: Submission) {
  const list = getStoredSubmissions();
  list.push(s);
  setStoredSubmissions(list);
}

export function getAllSubmissionsMerged(): Submission[] {
  const stored = getStoredSubmissions();
  const byId = new Map<string, Submission>();
  for (const s of SEED_SUBMISSIONS) byId.set(s.id, s);
  for (const s of stored) byId.set(s.id, s);
  return Array.from(byId.values());
}
