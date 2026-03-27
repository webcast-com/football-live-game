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

## Next Steps

### Optional: Supabase Backup Storage
To securely store and backup your API key in Supabase:

1. Create a `secrets` table in Supabase
2. Store encrypted API keys
3. Update the service to fetch from Supabase if local env var is missing

Refer to the implementation plan for details.

## Support

For API-Football documentation, visit:
- [API-Football Docs](https://www.api-football.com/documentation-v3)
- [Rapid API Console](https://rapidapi.com/api-sports/api/api-football)

For this project's implementation, check the code comments and type definitions.
