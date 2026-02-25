import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { useGame } from './hooks/useGame';
import Login from './pages/Login';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Game from './pages/Game';
import Result from './pages/Result';
import Sidebar from './components/layout/Sidebar';
import DashboardModule from './modules/DashboardModule';
import QuestionsModule from './modules/QuestionsModule';
import UsersModule from './modules/UsersModule';
import { Question, AppUser } from './types';

function App() {
  const [session, setSession] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState('');

  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [dbRole, setDbRole] = useState('');

  const {
    gameState,
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
    restartGame,
    resetGameState,
  } = useGame();


  // Reset game state when user changes
  useEffect(() => {
    if (session?.user?.id) {
      resetGameState();
    }
  }, [session?.user?.id, resetGameState]);

  const fetchQuestions = useCallback(async () => {
    setQuestionsLoading(true);
    setQuestionsError('');

    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setQuestions(data as Question[] || []);
    } catch (error: any) {
      setQuestionsError(error.message || 'No se pudieron cargar las preguntas.');
    } finally {
      setQuestionsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError('');

    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as AppUser[] || []);
    } catch (error: any) {
      setUsersError(error.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userEmail = session?.user?.email || '';

  const fetchDbRole = useCallback(async (email: string) => {
    if (!email) {
      setDbRole('');
      return;
    }

    const { data, error } = await supabase
      .from('app_users')
      .select('role')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) return;
    setDbRole(data?.role || '');
  }, []);

  useEffect(() => {
    if (!session) {
      setUsers([]);
      setDbRole('');
      return;
    }

    fetchQuestions();
    fetchUsers();
    fetchDbRole(userEmail);
  }, [session, fetchQuestions, fetchUsers, fetchDbRole, userEmail]);

  const role = useMemo(() => {
    const normalizedDbRole = String(dbRole || '').toLowerCase();
    const userRole = session?.user?.user_metadata?.role || '';
    
    // Explicit Admin Check
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);

    if (normalizedDbRole === 'admin' || userRole === 'admin' || adminEmails.includes(userEmail.toLowerCase())) {
      return 'admin';
    }
    return 'jugador';
  }, [dbRole, session, userEmail]);

  useEffect(() => {
    if (role !== 'admin' && (activeModule === 'questions' || activeModule === 'users')) {
      setActiveModule('dashboard');
    }
  }, [activeModule, role]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    resetGameState();
    setSession(null);
    setActiveModule('dashboard');
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-secondary/10 blur-[150px] rounded-full" />
        </div>
        <main className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Login />
        </main>
      </div>
    );
  }

  const renderGameModule = () => {
    switch (gameState) {
      case 'HOME':
        return <Home onStart={startGame} />;
      case 'CATEGORIES':
        return <Categories onSelect={selectCategory} />;
      case 'PLAYING':
        return (
          <Game
            questions={currentQuestions}
            currentIndex={currentIndex}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
            timeLeft={timeLeft}
            score={score}
          />
        );
      case 'RESULT':
        return (
          <Result
            score={score}
            correctCount={correctCount}
            wrongCount={wrongCount}
            onRestart={restartGame}
          />
        );
      default:
        return <Home onStart={startGame} />;
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardModule
            role={role}
            userEmail={userEmail}
            totalQuestions={questions.length}
            totalUsers={users.length}
            onGoToGame={() => setActiveModule('game')}
            onGoToQuestions={() => setActiveModule('questions')}
            onGoToUsers={() => setActiveModule('users')}
          />
        );
      case 'questions':
        return (
          <QuestionsModule
            canManage={role === 'admin'}
            questions={questions}
            loading={questionsLoading}
            error={questionsError}
            onRefresh={fetchQuestions}
          />
        );
      case 'users':
        return (
          <UsersModule
            canManage={role === 'admin'}
            users={users}
            loading={usersLoading}
            error={usersError}
            onRefresh={fetchUsers}
            currentUserEmail={userEmail}
          />
        );
      case 'game':
        return renderGameModule();
      default:
        return null;
    }
  };

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard' },
    ...(role === 'admin' ? [{ key: 'questions', label: 'Preguntas' }] : []),
    ...(role === 'admin' ? [{ key: 'users', label: 'Usuarios' }] : []),
    { key: 'game', label: 'Juego' },
  ];

  return (
    <div className="h-screen w-full relative bg-background overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
        <div className="absolute top-1/4 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 h-full flex flex-col md:flex-row">
        <Sidebar
          items={sidebarItems}
          activeItem={activeModule}
          onSelect={setActiveModule}
          userEmail={userEmail}
          role={role}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 h-full overflow-y-auto scrollbar-hide flex flex-col transition-all duration-500">
          <div className="md:hidden flex justify-between items-center p-6 glass border-b border-white/5 sticky top-0 z-[40] shrink-0">
             <button 
               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               className="p-2 bg-white/5 rounded-lg border border-white/10"
             >
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
             </button>
             <h1 className="text-xl font-black italic">TRÁNSITO<span className="text-primary">QUIZ</span></h1>
             <div className="w-10"></div> 
          </div>

          <div className="flex-1 p-6 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeModule}-${gameState}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="max-w-7xl mx-auto w-full"
              >
                {renderModule()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
