import { Bug, SpinnerGap, Trash } from 'phosphor-react';
import { Modal } from './Modal';
import { useState, useCallback } from 'react';
import { useSupabaseUser } from '../hooks/useSupabaseUser';
import { useTimeTravel } from '../hooks/useTimeTravel';
import { cleanupService } from '../services/cleanupService';
import { useAppStore } from '../stores/useAppStore';

interface DevToolsModalProps {
  onDataChange?: () => void;
}

export const DevToolsModal = ({ onDataChange }: DevToolsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { 
    isTimeTravelActive,
    formattedDate,
    advanceDay,
    resetToToday,
    isDev
  } = useTimeTravel();

  const {
    user,
    streak,
    stats,
    createPurchase,
    loading,
    refreshData
  } = useSupabaseUser();
  
  const { setSpinnerTickets } = useAppStore();

  // Notify parent component about data changes
  const notifyDataChange = useCallback(() => {
    if (onDataChange) {
      onDataChange();
    }
  }, [onDataChange]);

  // Demo function to simulate purchases
  const simulatePurchase = useCallback(async (amount: number) => {
    if (!user) {
      console.error('Please connect your wallet first to make a purchase.');
      return;
    }
    
    try {
      setPurchasing(true);
      const purchaseResult = await createPurchase(amount, 'USD', `Demo $${amount} Gift Card`, 'Gaming');
      
      if (purchaseResult) {
        // Refresh data to update UI immediately
        await refreshData();
        // Notify parent about data change
        notifyDataChange();
      } else {
        console.error('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      console.error('An error occurred during purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  }, [user, createPurchase, refreshData, notifyDataChange]);

  // Request confirmation for database cleanup
  const requestCleanup = useCallback(() => {
    if (!user) {
      console.error('Please connect your wallet first to clean up database.');
      return;
    }
    
    setShowConfirmation(true);
  }, [user]);
  
  // Confirmed cleanup - actually perform the operation
  const confirmCleanup = useCallback(async () => {
    if (!user) return;
    
    setCleaning(true);
    setShowConfirmation(false);
    
    try {
      // Use the cleanupService to clean up user data
      const success = await cleanupService.cleanupUserData(user.id);
      
      if (success) {
        // Refresh data to update UI immediately
        await refreshData();
        // Notify parent about data change
        notifyDataChange();
      } else {
        console.error('Failed to clean up the database. Please try again or contact support if the issue persists.');
      }
    } catch (error) {
      console.error('Error in cleanup process:', error);
      console.error('An error occurred during the cleanup process. Please try again.');
    } finally {
      setCleaning(false);
    }
  }, [user, refreshData, notifyDataChange]);
  
  // Cancel cleanup
  const cancelCleanup = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  // Handle time travel
  const handleAdvanceDay = useCallback(async () => {
    advanceDay();
    // Refresh data to update UI immediately after changing the date
    if (user) {
      await refreshData();
      // Notify parent about data change
      notifyDataChange();
    }
  }, [advanceDay, user, refreshData, notifyDataChange]);

  const handleResetToToday = useCallback(async () => {
    resetToToday();
    // Refresh data to update UI immediately after resetting the date
    if (user) {
      await refreshData();
      // Notify parent about data change
      notifyDataChange();
    }
  }, [resetToToday, user, refreshData, notifyDataChange]);

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    // Notify parent about data change when modal closes
    // This ensures any changes made while modal was open are reflected
    notifyDataChange();
  }, [notifyDataChange]);

  // Only show the dev tools button in development mode
  if (!isDev) return null;

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="h-10 w-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-full text-sm font-medium transition-colors"
      >
        <Bug size={20} className="text-primary" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Development Tools"
        icon={<Bug size={20} className="text-primary" />}
        maxWidth="max-w-lg"
      >
        <div className="space-y-6">
          {/* Time Travel Controls */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">⏰ Time Travel (Streak Testing)</h3>
            
            <div className="text-md text-white mb-3 flex items-center gap-2">
              Current Date: 
              <span className={`${isTimeTravelActive ? 'text-primary animate-pulse' : 'text-white'}`}>
                {formattedDate}
                {isTimeTravelActive && ' (Time Travel Active)'}
              </span>
            </div>
            
            <div className="flex gap-3 mb-3">
              <button
                onClick={handleAdvanceDay}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 flex-1"
              >
                +1 Day
              </button>
              
              <button
                onClick={handleResetToToday}
                className="bg-primary hover:bg-secondary text-black px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 flex-1"
              >
                Reset Date
              </button>
            </div>

            <div className="text-sm text-gray-400">
              Buy today → +1 Day → Buy tomorrow = 2-day streak!
            </div>
          </div>

          {/* Demo Purchase Buttons */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">🧪 Demo Purchases (Testing)</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => simulatePurchase(50)}
                disabled={loading || !user || purchasing}
                className="bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-xl font-medium transition-colors relative"
              >
                {purchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerGap size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    $50 Gift Card
                    <div className="text-xs opacity-80">+1 Ticket</div>
                  </>
                )}
              </button>
              <button
                onClick={() => simulatePurchase(100)}
                disabled={loading || !user || purchasing}
                className="bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-xl font-medium transition-colors"
              >
                {purchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerGap size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    $100 Gift Card
                    <div className="text-xs opacity-80">+2 Tickets</div>
                  </>
                )}
              </button>
              <button
                onClick={() => simulatePurchase(150)}
                disabled={loading || !user || purchasing}
                className="bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-xl font-medium transition-colors"
              >
                {purchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerGap size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    $150 Gift Card
                    <div className="text-xs opacity-80">+3 Tickets (Max)</div>
                  </>
                )}
              </button>
              <button
                onClick={() => simulatePurchase(200)}
                disabled={loading || !user || purchasing}
                className="bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-xl font-medium transition-colors"
              >
                {purchasing ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerGap size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    $200 Gift Card
                    <div className="text-xs opacity-80">+3 Tickets (Max)</div>
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {!user ? 'Connect your wallet to make purchases' : 'These buttons simulate gift card purchases to test the spinning system. Max 3 spins per day.'}
            </div>
          </div>

          {/* Database Cleanup */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">🗑️ Database Tools</h3>
            
            {showConfirmation ? (
              <div>
                <div className="mb-3 text-white text-sm">
                  <p className="mb-2">This will completely reset your account data, including:</p>
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    <li>Purchases history</li>
                    <li>Spin tickets and limits</li>
                    <li>Rewards</li>
                    <li>Streak progress</li>
                    <li>Stats and achievements</li>
                  </ul>
                  <p>Your wallet connection will be preserved.</p>
                  <p className="mt-2 text-red-400 font-medium">Are you sure you want to continue?</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={cancelCleanup}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmCleanup}
                    disabled={cleaning}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    {cleaning ? (
                      <div className="flex items-center justify-center gap-2">
                        <SpinnerGap size={16} className="animate-spin" />
                        <span>Cleaning...</span>
                      </div>
                    ) : 'Yes, Reset All Data'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={requestCleanup}
                disabled={loading || !user || cleaning}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-medium transition-colors w-full flex items-center justify-center gap-2"
              >
                {cleaning ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerGap size={16} className="animate-spin" />
                    <span>Cleaning Database...</span>
                  </div>
                ) : (
                  <>
                    <Trash size={18} />
                    Fresh Start (Reset All Data)
                  </>
                )}
              </button>
            )}
            
            {!showConfirmation && (
              <div className="text-xs text-gray-500 mt-3 text-center">
                Completely resets all your data in the database while preserving your wallet connection
              </div>
            )}
            
            {!showConfirmation && (
              <div className="text-xs text-red-400 mt-1 text-center">
                Warning: This action cannot be undone!
              </div>
            )}
          </div>

          {/* Current Stats */}
          {streak && stats && (
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">📊 Current Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary">{streak.current}</div>
                  <div className="text-sm text-gray-400">Current Streak</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-secondary">{streak.best}</div>
                  <div className="text-sm text-gray-400">Best Streak</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-green-500">{stats.level}</div>
                  <div className="text-sm text-gray-400">Level</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-yellow-500">{stats.xp}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}; 