import { ConnectMenu } from './components';
import { useMiniApp } from './hooks/useMiniApp';

const App = () => {
  const { isMiniApp, isLoading } = useMiniApp();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-8 p-8 min-h-screen">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-blue-400">
        {isMiniApp ? 'Farcaster Mini App' : 'Regular Web App'}
      </h1>
      <ConnectMenu />
    </div>
  );
};

export default App;
