# API-Football Integration Guide

## Overview

This project now integrates with the **API-Football (Rapid API)** to fetch live sports data including:
- Live match scores with real-time updates
- Upcoming fixtures and matches
- League standings and rankings
- Top scorers and player statistics

## Setup Instructions

### 1. Get Your API Key

1. Visit [API-Football on Rapid API](https://rapidapi.com/api-sports/api/api-football)
2. Sign up for a free account (100 requests/day limit)
3. Subscribe to the API (free tier available)
4. Copy your API key

### 2. Add Environment Variable

Add your API key to the project:

```bash
VITE_RAPID_API_KEY=your_api_key_here
```

The `.env.local.example` file shows the required format.

### 3. Verify Integration

Once configured, the following features should work:

- **Live Scores** (`/src/components/sports/LiveScores.tsx`)
  - Real-time match scores and status updates
  - Filter by league, status, or search
  - Mark favorites

- **Upcoming Matches** (`/src/components/sports/UpcomingMatches.tsx`)
  - View next 7 days of scheduled matches
  - Set reminders for matches
  - Venue and team information

- **League Standings** (`/src/components/sports/Standings.tsx`)
  - Select from 6 major leagues
  - Sort by rank, team name, points, etc.
  - Real-time standings data

- **Top Scorers** (`/src/components/sports/TopScorers.tsx`)
  - View top 10 goal scorers
  - Switch between goals and assists
  - Filter by league

## API Endpoints Used

The integration uses the following API-Football endpoints:

- `GET /fixtures` - Live and upcoming matches
- `GET /standings` - League standings
- `GET /players/topscorers` - Top goal scorers
- `GET /players/topassists` - Top assists leaders

## File Structure

```
src/
├── types/
│   └── apiFootball.ts          # TypeScript types for API responses
├── services/
│   └── apiFootball.ts          # API service with all endpoints
├── hooks/
│   └── useFootballAPI.ts       # React Query hooks for data fetching
└── components/sports/
    ├── LiveScores.tsx          # Updated with API integration
    ├── UpcomingMatches.tsx      # Updated with API integration
    ├── Standings.tsx           # Updated with API integration
    └── TopScorers.tsx          # Updated with API integration
```

## Error Handling

All components include:
- Loading states with spinners
- Error messages with troubleshooting hints
- Empty state messages when no data is available
- Automatic retry via React Query

## Rate Limiting

Free tier: 100 requests/day

Refetch intervals (optimized to stay within limits):
- Live scores: 30-60 seconds
- Standings: 10 minutes
- Top scorers: 15 minutes
- Upcoming matches: 30 minutes

## Troubleshooting

**Issue: "API key not found" error**
- Verify `VITE_RAPID_API_KEY` is added to your `.env.local`
- Restart the dev server after adding the key
- Check that the API key is valid on Rapid API

**Issue: Rate limit exceeded**
- Free tier has 100 requests/day limit
- Consider upgrading to a paid plan
- Check refetch intervals in `useFootballAPI.ts`

**Issue: No data showing**
- Check browser console for detailed error messages
- Verify your API key has access to the endpoints
- Ensure the league/season is available in the API

## Optional: Supabase API Key Backup & Management

This project includes an **optional Supabase utility** for securely storing and managing API keys with row-level security.

### Benefits

- **Centralized Management**: Manage all API keys in one place
- **Secure Storage**: Keys encrypted at rest in Supabase
- **Easy UI**: Click the Settings icon (⚙️) to add/manage keys
- **Automatic Fallback**: App uses Supabase keys if environment variables aren't set
- **Multi-Key Support**: Store multiple keys (production, staging, etc.)

### Quick Setup

1. **Database**: The migration script at `/scripts/setup-api-key-backup.sql` creates the `api_keys` table with RLS policies
2. **UI**: Click the Settings icon (⚙️) in the header to open the API Key Manager
3. **Usage**: Add your API key through the UI - it's automatically saved to Supabase

### Key Priority

The application uses this order for API keys:
1. **Environment Variables** (highest priority) - `VITE_RAPID_API_KEY`
2. **Supabase Storage** (fallback) - Automatically fetched if env var not set

### Features

- View all stored keys
- Add new keys with optional metadata
- Copy keys to clipboard
- Show/hide key values for security
- Delete or deactivate keys
- Track creation and last usage dates

### Detailed Guide

For comprehensive documentation on the Supabase API key backup system, see:
- [`SUPABASE_API_KEY_BACKUP.md`](./SUPABASE_API_KEY_BACKUP.md)

This includes:
- Complete setup instructions
- Database schema details
- TypeScript API reference
- Security considerations
- Troubleshooting guide

## Support

For API-Football documentation, visit:
- [API-Football Docs](https://www.api-football.com/documentation-v3)
- [Rapid API Console](https://rapidapi.com/api-sports/api/api-football)

For Supabase help:
- [Supabase Docs](https://supabase.com/docs)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

For this project's implementation, check the code comments and type definitions.
