export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  QUIZ = 'QUIZ',
  TIMELINE = 'TIMELINE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number; // 0-3
  explanation: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  significance: string;
}

export interface QuizResult {
  score: number;
  total: number;
  history: {
    questionId: number;
    userAnswer: number;
    isCorrect: boolean;
  }[];
}