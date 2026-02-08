import legalRules from "@/lib/data/legal_rules.json";

export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  scenario?: string;
  question?: string;
  options: QuestionOption[];
  explanation: string;
  article?: string;
  consequence_if_wrong?: string;
}

export interface SimulationData {
  title: string;
  description: string;
  constitutional_basis: string;
  questions: Question[];
}

export type SimulationType = "fir" | "arrest" | "remand";

export function getSimulationData(type: SimulationType): SimulationData {
  switch (type) {
    case "fir":
      return legalRules.fir_rules;
    case "arrest":
      return legalRules.arrest_rules;
    case "remand":
      return legalRules.remand_rules;
  }
}

export function getCitizenRights() {
  return legalRules.citizen_rights.basic_rights;
}

export function getDosAndDonts() {
  return legalRules.citizen_rights.dos_and_donts;
}

export function getCitizenQuiz(): Question[] {
  return legalRules.citizen_rights.quiz;
}

export interface ValidationResult {
  isCorrect: boolean;
  explanation: string;
  article?: string;
  consequence?: string;
  correctOptionId: string;
}

export function validateAnswer(
  question: Question,
  selectedOptionId: string
): ValidationResult {
  const correctOption = question.options.find((o) => o.correct);
  const isCorrect = selectedOptionId === correctOption?.id;

  return {
    isCorrect,
    explanation: question.explanation,
    article: question.article,
    consequence: isCorrect ? undefined : question.consequence_if_wrong,
    correctOptionId: correctOption?.id || "",
  };
}
