import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { supabase } from '../lib/supabase';
import { Question } from '../types';

export type GameState = 'HOME' | 'CATEGORIES' | 'PLAYING' | 'RESULT';

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef<any>(null);


  // Cargar preguntas desde Supabase
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setAllQuestions(data as Question[]);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Sounds
  const sounds = useRef({
    correct: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3'], volume: 0.5 }),
    wrong: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/601/601-preview.mp3'], volume: 0.5 }),
    timeout: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/602/602-preview.mp3'], volume: 0.5 }),
  });

  const startGame = () => setGameState('CATEGORIES');

  const selectCategory = (category: string) => {
    const filtered = allQuestions
      .filter(q => q.category === category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); 
    
    setSelectedCategory(category);
    setCurrentQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameState('PLAYING');
    resetTurn();
  };

  const resetTurn = useCallback(() => {
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetTurn();
    } else {
      setGameState('RESULT');
    }
  }, [currentIndex, currentQuestions.length, resetTurn]);

  const handleAnswer = useCallback((option: string | null) => {
    if (isAnswered) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQ = currentQuestions[currentIndex];
    const isCorrect = option === currentQ?.correct_answer;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      sounds.current.correct.play();
    } else {
      setWrongCount(prev => prev + 1);
      sounds.current.wrong.play();
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [isAnswered, currentQuestions, currentIndex, nextQuestion]);

  useEffect(() => {
    if (gameState === 'PLAYING' && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            sounds.current.timeout.play();
            handleAnswer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentIndex, isAnswered, handleAnswer]);

  const restartGame = () => {
    setGameState('HOME');
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    resetTurn();
  };

  const reset = useCallback(() => {
    setGameState('HOME');
    setSelectedCategory(null);
    setCurrentQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, []);

  return {
    gameState,
    selectedCategory,
    currentQuestions,
    currentIndex,
    score,
    correctCount,
    wrongCount,
    timeLeft,
    selectedAnswer,
    isAnswered,
    isLoading,
    startGame,
    selectCategory,
    handleAnswer,
    restartGame,
    resetGameState: reset
  };
};
