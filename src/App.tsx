import React, { useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { Home, Spinner, Scoreboard, Profile, Rewards, Milestones } from './pages';
import { useMiniApp } from './hooks/useMiniApp';
import { useAppStore } from './stores/useAppStore';
import { useSupabaseUser } from './hooks/useSupabaseUser';

// Memoized page components to prevent unnecessary re-renders
const MemoizedHome = React.memo(Home);
const MemoizedRewards = React.memo(Rewards);
const MemoizedSpinner = React.memo(Spinner);
const MemoizedMilestones = React.memo(Milestones);
const MemoizedScoreboard = React.memo(Scoreboard);
const MemoizedProfile = React.memo(Profile);

const App = () => {
  const { isLoading } = useMiniApp();
  const { activeTab } = useAppStore();
  
  // Initialize user data at app level so counters work immediately
  useSupabaseUser();

  // Memoize page rendering to prevent unnecessary re-renders
  const currentPage = useMemo(() => {
    switch (activeTab) {
      case 'home':
        return <MemoizedHome />;
      case 'rewards':
        return <MemoizedRewards />;
      case 'spinner':
        return <MemoizedSpinner />;
      case 'milestones':
        return <MemoizedMilestones />;
      case 'scoreboard':
        return <MemoizedScoreboard />;
      case 'profile':
        return <MemoizedProfile />;
      default:
        return <MemoizedHome />;
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative">
      <Header />
      
      <main className="flex-1 pb-20 pt-[70px] relative">
        {currentPage}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default React.memo(App);
