# Widgets API Integration Guide

## Overview

The **Widgets API** (`https://widgets.api-sports.io/3.1.0/config`) is a free, no-key-required endpoint that provides comprehensive football games data including:

- All live games across multiple leagues
- Upcoming fixtures and schedules
- Historical game results
- Team information and logos
- League details
- Real-time score updates

## Key Features

✅ **No API Key Required** - Free to use without authentication  
✅ **Real-time Data** - Live match scores and status updates  
✅ **Comprehensive** - Covers multiple leagues globally  
✅ **Fast Caching** - Implements 5-minute cache for efficiency  
✅ **Type-Safe** - Full TypeScript support with interfaces  

## Getting Started

### Basic Usage

#### Fetch All Games

```typescript
import { useAllGames } from '@/hooks/useWidgetsApi';

function MyComponent() {
  const { data: games, isLoading, error } = useAllGames();

  if (isLoading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {games?.map((game) => (
        <div key={game.id}>
          <h3>
            {game.home.name} vs {game.away.name}
          </h3>
          <p>
            Score: {game.goals.home} - {game.goals.away}
          </p>
          <p>Status: {game.status}</p>
        </div>
      ))}
    </div>
  );
}
```

#### Fetch Live Games Only

```typescript
import { useLiveGames } from '@/hooks/useWidgetsApi';

function LiveScoresBoard() {
  const { data: liveGames, isLoading } = useLiveGames();

  return (
    <div>
      <h2>Live Matches ({liveGames?.length || 0})</h2>
      {/* Render live games */}
    </div>
  );
}
```

#### Fetch Games by League

```typescript
import { useGamesByLeague } from '@/hooks/useWidgetsApi';

function PremierLeagueMatches() {
  const { data: games } = useGamesByLeague('Premier League');

  return (
    <div>
      {games?.map((game) => (
        // Render game
      ))}
    </div>
  );
}
```

#### Fetch Games by Date

```typescript
import { useGamesByDate } from '@/hooks/useWidgetsApi';

function TodaysMatches() {
  const today = new Date().toISOString().split('T')[0];
  const { data: games } = useGamesByDate(today);

  return <div>{/* Render today's games */}</div>;
}
```

#### Get All Available Leagues

```typescript
import { useAllLeagues } from '@/hooks/useWidgetsApi';

function LeagueSelector() {
  const { data: leagues } = useAllLeagues();

  return (
    <select>
      {leagues?.map((league) => (
        <option key={league} value={league}>
          {league}
        </option>
      ))}
    </select>
  );
}
```

## Data Structure

### Game Object

```typescript
interface Game {
  id: number;              // Unique game ID
  league: string;          // League name (e.g., "Premier League")
  leagueId: number;        // League identifier
  season: number;          // Season year
  date: string;            // ISO date string (YYYY-MM-DD)
  timestamp: number;       // Unix timestamp
  timezone: string;        // Timezone (e.g., "UTC")
  home: {
    id: number;            // Team ID
    name: string;          // Team name
    logo: string;          // Team logo URL
  };
  away: {
    id: number;
    name: string;
    logo: string;
  };
  goals: {
    home: number | null;   // Goals scored (null if not started)
    away: number | null;
  };
  status: string;          // Full status (e.g., "First Half")
  statusShort: string;     // Short status (e.g., "1H", "LIVE", "FT")
  elapsed: number | null;  // Minutes elapsed (null if not started)
  venue: string;           // Stadium/venue name
  referee: string | null;  // Referee name
  coverage: string[];      // Available coverage types
}
```

## Available Hooks

### `useAllGames()`

Fetches all games from the API.

```typescript
const { data, isLoading, isError, error } = useAllGames();
```

**Cache Duration**: 5 minutes  
**Stale Time**: 5 minutes

### `useLiveGames()`

Fetches only games currently in progress.

```typescript
const { data: liveGames, isLoading } = useLiveGames();
```

**Cache Duration**: 5 minutes  
**Stale Time**: 1 minute (updates more frequently)

### `useGamesByLeague(league: string)`

Fetches games filtered by league name.

```typescript
const { data: games } = useGamesByLeague('Premier League');
```

**Parameters**:
- `league` (string): League name to filter by

### `useGamesByDate(date: string)`

Fetches games for a specific date (YYYY-MM-DD format).

```typescript
const { data: games } = useGamesByDate('2025-03-29');
```

**Parameters**:
- `date` (string): Date in YYYY-MM-DD format

### `useAllLeagues()`

Fetches all unique leagues available in the dataset.

```typescript
const { data: leagues } = useAllLeagues();
```

**Cache Duration**: 10 minutes  
**Stale Time**: 30 minutes

## Service Functions

If you prefer to use the service directly instead of hooks:

```typescript
import {
  fetchAllGames,
  fetchLiveGames,
  fetchGamesByLeague,
  fetchGamesByDate,
  fetchAllLeagues,
  fetchGameById,
  clearCache,
} from '@/services/widgetsApi';

// Usage
const allGames = await fetchAllGames();
const liveGames = await fetchLiveGames();
const gameById = await fetchGameById(12345);
```

## Caching Strategy

The Widgets API implementation uses intelligent caching:

- **All Games**: 5-minute cache
- **Live Games**: 1-minute stale time (more frequent updates)
- **By League/Date**: 5-minute cache
- **Leagues List**: 30-minute stale time (changes infrequently)

To manually clear the cache:

```typescript
import { clearCache } from '@/services/widgetsApi';

clearCache(); // Clears all cached data
```

## Status Codes

The API uses the following status short codes:

- `NOT_STARTED` - Match hasn't started yet
- `LIVE` - Match is currently live
- `1H` - First half in progress
- `HT` - Half time
- `2H` - Second half in progress
- `ET` - Extra time
- `PENS` - Penalties
- `FT` - Full time (completed)
- `AET` - After extra time
- `CANCELLED` - Match cancelled
- `POSTPONED` - Match postponed

## Error Handling

All hooks provide error information:

```typescript
const { data, isLoading, isError, error } = useAllGames();

if (isError) {
  console.error('Failed to fetch games:', error?.message);
}
```

## Performance Tips

1. **Use stale time appropriately**: Live games use 1-minute stale time, while leagues use 30 minutes
2. **Enable queries conditionally**: Hooks support `enabled` option
3. **Refetch on demand**: Use query client methods for manual refetches
4. **Lazy load**: Only fetch data when components mount

```typescript
// Only fetch when league is selected
const { data: games } = useGamesByLeague(selectedLeague || '');
```

## Troubleshooting

### Empty Data

- Check if the date you're querying is valid
- Ensure league name matches exactly (case-sensitive)
- Try `useAllGames()` to see if API is accessible

### Slow Loading

- Data is cached for 5 minutes - wait if you just fetched
- Use `clearCache()` to force a fresh fetch
- Check network connectivity

### No Live Games

- Live games might be empty if no matches are currently playing
- Check the date - live games only appear during scheduled match times
- Filter by date to see games scheduled for today

## API Endpoint

**Endpoint**: `https://widgets.api-sports.io/3.1.0/config`  
**Method**: GET  
**Authentication**: None required  
**Rate Limiting**: Depends on provider (typically generous for free tier)

## Comparison: Widgets API vs RapidAPI

| Feature | Widgets API | RapidAPI |
|---------|------------|----------|
| Authentication | None required | Requires API key |
| Cost | Free | Free tier (100 req/day) |
| Rate Limit | Generous | 100 requests/day |
| Data Coverage | Comprehensive | Comprehensive |
| Real-time | Yes | Yes |
| Cache Strategy | Built-in | Custom |

## Best Practices

1. **Use hooks over direct service calls** - Better React integration and caching
2. **Handle loading states** - Always check `isLoading`
3. **Handle errors gracefully** - Provide fallback UI
4. **Cache management** - Don't clear cache unnecessarily
5. **Filter on client** - Use JavaScript `.filter()` for small datasets rather than multiple API calls

## Integration with Existing Components

The Widgets API can be used alongside existing RapidAPI integration:

- **Widgets API**: For basic game data, leagues, and live scores
- **RapidAPI**: For detailed stats, player data, standings with more granular filtering

Use Widgets API for performance, RapidAPI for detailed analytics.

## Support & Resources

- **API Documentation**: https://www.api-sports.io/
- **Status Codes**: Check the Status Codes section above
- **Debug**: Check browser console for `[Widgets API]` logs
