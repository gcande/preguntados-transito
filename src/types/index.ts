export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct_answer: string;
  created_at?: string;
}

export interface AppUser {
  id: string;
  full_name: string;
  email: string;
  cedula: string;
  role: 'admin' | 'jugador';
  created_at?: string;
  updated_at?: string;
}

export interface GameState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  lives: number;
  timeLeft: number;
  isGameOver: boolean;
  isGameStarted: boolean;
}
