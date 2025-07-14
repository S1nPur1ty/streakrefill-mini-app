import { Header, BottomNavigation } from './components';
import { Home, Spinner, Scoreboard, Profile, Rewards } from './pages';
import { useMiniApp } from './hooks/useMiniApp';
import { useAppStore } from './stores';

const App = () => {
  const { isMiniApp, isLoading } = useMiniApp();
  const { activeTab } = useAppStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'rewards':
        return <Rewards />;
      case 'spinner':
        return <Spinner />;
      case 'scoreboard':
        return <Scoreboard />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 overflow-auto pb-20">
        {renderPage()}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default App;
