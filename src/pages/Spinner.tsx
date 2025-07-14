import { SpinnerWheel } from '../components';
import { useAppStore } from '../stores';

export const Spinner = () => {
  const { addSpinnerTickets } = useAppStore();

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        <SpinnerWheel />
        
        {/* Demo button to add tickets */}
        <div className="text-center mt-8">
          <button
            onClick={() => addSpinnerTickets(3)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Get More Tickets (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}; 