import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { questions } from '../data/questions';

export const useGame = () => {
  const [gameState, setGameState] = useState('HOME'); // HOME, CATEGORIES, PLAYING, RESULT
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const timerRef = useRef(null);

  // Sounds (Mock URLs/Paths - ensure they exist in src/assets/sounds/)
  const sounds = useRef({
    correct: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3'], volume: 0.5 }),
    wrong: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/601/601-preview.mp3'], volume: 0.5 }),
    timeout: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/602/602-preview.mp3'], volume: 0.5 }),
  });

  const startGame = () => setGameState('CATEGORIES');

  const selectCategory = (category) => {
    const filtered = questions
      .filter(q => q.category === category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 10); // 10 questions per round
    
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

  const handleAnswer = useCallback((option) => {
    if (isAnswered) return;
    
    clearInterval(timerRef.current);
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestions[currentIndex].correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrectCount(prev => prev + 1);
      sounds.current.correct.play();
    } else {
      setWrongCount(prev => prev + 1);
      sounds.current.wrong.play();
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [isAnswered, currentQuestions, currentIndex, nextQuestion]);

  useEffect(() => {
    if (gameState === 'PLAYING' && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            sounds.current.timeout.play();
            handleAnswer(null); // Timeout is wrong answer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, currentIndex, isAnswered, handleAnswer]);

  const restartGame = () => {
    setGameState('HOME');
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
  };

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
    startGame,
    selectCategory,
    handleAnswer,
    restartGame
  };
};
