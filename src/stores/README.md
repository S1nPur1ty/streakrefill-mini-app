# Zustand Store Documentation

This app uses Zustand as the core state management solution. The store is centralized and provides a clean API for managing global state.

## Store Structure

### `useAppStore`

The main application store that manages all global state:

#### Navigation State
- `activeTab`: Current active tab ('home', 'spinner', 'scoreboard')
- `setActiveTab(tab)`: Change the active tab

#### Wallet State
- `isConnected`: Whether wallet is connected
- `walletAddress`: Current wallet address
- `setWalletInfo(connected, address)`: Update wallet connection state

#### Spinner State
- `spinnerTickets`: Number of available spinner tickets
- `addSpinnerTickets(count)`: Add tickets
- `useSpinnerTicket()`: Use one ticket

#### Mini App State
- `isMiniApp`: Whether running in Farcaster Mini App
- `isLoading`: Loading state for Mini App detection
- `setMiniAppStatus(isMiniApp, isLoading)`: Update Mini App status

#### User Preferences
- `theme`: Current theme ('dark' | 'light')
- `toggleTheme()`: Toggle between themes

#### Gift Cards (Future)
- `selectedGiftCardCategory`: Current selected category
- `setGiftCardCategory(category)`: Change category

#### Scoreboard (Future)
- `userXP`: User experience points
- `userScore`: User score
- `addXP(amount)`: Add XP
- `addScore(amount)`: Add score

## Usage Examples

```typescript
import { useAppStore } from '../stores';

// In a component
const { activeTab, setActiveTab, spinnerTickets } = useAppStore();

// Change tab
setActiveTab('spinner');

// Use spinner ticket
const { useSpinnerTicket } = useAppStore();
useSpinnerTicket();
```

## Benefits

1. **Centralized State**: All app state in one place
2. **TypeScript Support**: Full type safety
3. **DevTools**: Redux DevTools integration for debugging
4. **Performance**: Automatic re-rendering optimization
5. **Simplicity**: No providers or complex setup needed

## Store Updates

The store automatically syncs with:
- Wallet connection state (via Header component)
- Mini App detection (via useMiniApp hook)
- Navigation state (via BottomNavigation component) 