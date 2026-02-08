import AsyncStorage from "@react-native-async-storage/async-storage";

const SCORE_KEY = "civica_scores";

export interface UserScore {
  totalXP: number;
  totalCorrect: number;
  totalIncorrect: number;
  firCompleted: boolean;
  arrestCompleted: boolean;
  remandCompleted: boolean;
  firScore: number;
  arrestScore: number;
  remandScore: number;
  citizenQuizCompleted: boolean;
  citizenQuizScore: number;
  citizenBadge: string | null;
}

const DEFAULT_SCORE: UserScore = {
  totalXP: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  firCompleted: false,
  arrestCompleted: false,
  remandCompleted: false,
  firScore: 0,
  arrestScore: 0,
  remandScore: 0,
  citizenQuizCompleted: false,
  citizenQuizScore: 0,
  citizenBadge: null,
};

export async function getScores(): Promise<UserScore> {
  try {
    const stored = await AsyncStorage.getItem(SCORE_KEY);
    if (stored) {
      return { ...DEFAULT_SCORE, ...JSON.parse(stored) };
    }
    return { ...DEFAULT_SCORE };
  } catch {
    return { ...DEFAULT_SCORE };
  }
}

export async function saveScores(scores: UserScore): Promise<void> {
  try {
    await AsyncStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  } catch {
    console.error("Failed to save scores");
  }
}

export async function updateSimulationScore(
  type: "fir" | "arrest" | "remand",
  correct: number,
  total: number
): Promise<UserScore> {
  const scores = await getScores();
  const xpEarned = correct * 20;
  const scorePercent = Math.round((correct / total) * 100);

  scores.totalXP += xpEarned;
  scores.totalCorrect += correct;
  scores.totalIncorrect += total - correct;

  switch (type) {
    case "fir":
      scores.firCompleted = true;
      scores.firScore = scorePercent;
      break;
    case "arrest":
      scores.arrestCompleted = true;
      scores.arrestScore = scorePercent;
      break;
    case "remand":
      scores.remandCompleted = true;
      scores.remandScore = scorePercent;
      break;
  }

  await saveScores(scores);
  return scores;
}

export async function updateCitizenScore(
  correct: number,
  total: number
): Promise<UserScore> {
  const scores = await getScores();
  const xpEarned = correct * 15;
  const scorePercent = Math.round((correct / total) * 100);

  scores.totalXP += xpEarned;
  scores.totalCorrect += correct;
  scores.totalIncorrect += total - correct;
  scores.citizenQuizCompleted = true;
  scores.citizenQuizScore = scorePercent;

  if (scorePercent >= 80) {
    scores.citizenBadge = "Legal Eagle";
  } else if (scorePercent >= 60) {
    scores.citizenBadge = "Aware Citizen";
  } else {
    scores.citizenBadge = "Learner";
  }

  await saveScores(scores);
  return scores;
}

export async function resetScores(): Promise<void> {
  await AsyncStorage.removeItem(SCORE_KEY);
}

export function getCompletionPercent(scores: UserScore): number {
  let completed = 0;
  if (scores.firCompleted) completed++;
  if (scores.arrestCompleted) completed++;
  if (scores.remandCompleted) completed++;
  if (scores.citizenQuizCompleted) completed++;
  return Math.round((completed / 4) * 100);
}
