# Supabase API Key Backup & Management

This optional utility allows you to securely store and manage API keys in Supabase with row-level security (RLS) policies. This is useful if you want a centralized place to manage API keys across your application.

## Features

- **Secure Storage**: API keys are encrypted and stored in Supabase
- **Row-Level Security**: Each user can only access their own keys
- **Automatic Fallback**: If environment variables aren't set, the app will use Supabase-stored keys
- **Easy Management**: Beautiful UI to add, view, edit, and delete API keys
- **Metadata Support**: Store additional information about each key (plan, limits, etc.)

## Setup

### 1. Initialize the Database Table

The migration script has already been created at `/scripts/setup-api-key-backup.sql`. To create the `api_keys` table in Supabase:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query" and paste the contents of `setup-api-key-backup.sql`
4. Click "Run"

**Option B: Using Supabase CLI**
```bash
supabase migration up
```

### 2. Access the API Key Manager

The API Key Manager is available in the header of your app (Settings icon). Click it to:
- View all stored API keys
- Add new API keys
- Copy keys to clipboard
- Delete keys
- Show/hide key values

## Usage

### Adding an API Key

1. Click the Settings icon (⚙️) in the header
2. In the "Add New API Key" section:
   - **Key Name**: Give it a descriptive name (e.g., "API-Football Production")
   - **Service**: Select the service (API-Football, OpenAI, Stripe, etc.)
   - **API Key Value**: Paste your actual API key
   - **Metadata** (optional): Add JSON metadata like `{"plan": "free", "limit": 100}`
3. Click "Add API Key"

### Retrieving API Keys

The application uses this priority for API keys:
1. **Environment Variables** (highest priority)
   - `VITE_RAPID_API_KEY` for API-Football
   - `VITE_OPENAI_API_KEY` for OpenAI
   - etc.

2. **Supabase Backup** (fallback)
   - If environment variables are not set, the app will automatically fetch from Supabase

This means you can:
- Use environment variables in production
- Use Supabase storage as a fallback or for development
- Mix and match as needed

## Architecture

### Database Schema

The `api_keys` table has the following structure:

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,                    -- Unique identifier
  key_name VARCHAR(255) NOT NULL,         -- User-friendly name
  key_value TEXT NOT NULL,                -- Encrypted API key
  service VARCHAR(100) NOT NULL,          -- Service identifier (api-football, openai, etc.)
  is_active BOOLEAN DEFAULT TRUE,         -- Soft delete support
  created_at TIMESTAMP,                   -- Creation timestamp
  updated_at TIMESTAMP,                   -- Last update timestamp
  last_used_at TIMESTAMP,                 -- Track usage
  created_by UUID,                        -- Reference to auth.users
  metadata JSONB                          -- Additional info (plan, limits, etc.)
);
```

### Row-Level Security Policies

The following RLS policies are enforced:

- **SELECT**: Users can only view their own keys
- **INSERT**: Users can only insert keys for themselves
- **UPDATE**: Users can only update their own keys
- **DELETE**: Users can only delete their own keys

This ensures complete isolation between users.

### TypeScript Interface

```typescript
interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
  service: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
  metadata: Record<string, any> | null;
}
```

## API Reference

### ApiKeyManager Service

The `ApiKeyManager` class provides static methods for key management:

#### `getApiKey(serviceName: string): Promise<string | null>`
Get an API key, with automatic fallback from environment to Supabase.

```typescript
const apiKey = await ApiKeyManager.getApiKey('api-football');
```

#### `storeApiKey(serviceName, keyValue, keyName?, metadata?): Promise<ApiKey | null>`
Store a new API key in Supabase.

```typescript
const newKey = await ApiKeyManager.storeApiKey(
  'api-football',
  'your-key-value',
  'My API Key',
  { plan: 'free', limit: 100 }
);
```

#### `updateApiKey(serviceName, newKeyValue, metadata?): Promise<ApiKey | null>`
Update an existing API key.

```typescript
await ApiKeyManager.updateApiKey('api-football', 'new-key-value');
```

#### `deleteApiKey(serviceName): Promise<boolean>`
Delete an API key.

```typescript
await ApiKeyManager.deleteApiKey('api-football');
```

#### `deactivateApiKey(serviceName): Promise<boolean>`
Soft delete (deactivate) an API key without removing it from the database.

```typescript
await ApiKeyManager.deactivateApiKey('api-football');
```

#### `listApiKeys(): Promise<ApiKey[]>`
List all API keys for the current user.

```typescript
const allKeys = await ApiKeyManager.listApiKeys();
```

## Security Considerations

1. **Encryption at Rest**: Supabase encrypts all data at rest
2. **Row-Level Security**: Only authenticated users can access their own keys
3. **HTTPS Only**: All data is transmitted over encrypted connections
4. **No Logging**: API key values are never logged
5. **Short Masks**: When displayed in UI, keys show only first 4 and last 4 characters

## Environment Variables

You still need to set environment variables for the app to work initially:

```bash
# .env.local
VITE_RAPID_API_KEY=your-rapidapi-key-here
```

Once you've stored keys in Supabase, the app can work without environment variables as a fallback.

## Troubleshooting

### "API key not found" error

This means neither the environment variable nor Supabase has a key set. To fix:

1. **Add environment variable**: Set `VITE_RAPID_API_KEY` in `.env.local`
   OR
2. **Use API Key Manager**: Click the Settings icon and add your key through the UI

### "Failed to load API keys" in settings

This usually means:
- You're not authenticated
- Supabase connection is down
- Row-level security policies need to be checked

### Keys show as "Inactive"

Inactive keys won't be used by the app. To activate:
1. Delete the inactive key
2. Add a new key with the same service name

## Performance Tips

- The app caches API responses for 5-15 minutes depending on the data type
- Keys are only fetched from Supabase when environment variables aren't set
- Consider using environment variables in production for best performance

## Examples

### Using with API-Football

```typescript
import { ApiKeyManager } from '@/services/apiKeyManager';
import { apiFootball } from '@/services/apiFootball';

// Get the key (automatically falls back to Supabase if env var not set)
const apiKey = await ApiKeyManager.getApiKey('api-football');

// Use the API
const standings = await apiFootball.getStandings(39);
```

### Storing Multiple Keys

```typescript
// Store production and staging keys
await ApiKeyManager.storeApiKey('api-football', 'prod-key-123', 'API-Football Prod', {
  environment: 'production',
  limit: 1000,
});

await ApiKeyManager.storeApiKey('api-football', 'staging-key-456', 'API-Football Staging', {
  environment: 'staging',
  limit: 100,
});
```

## Next Steps

1. ✅ Database table created
2. ✅ RLS policies enabled
3. ✅ UI component implemented
4. ✅ API service configured with fallback
5. Start adding your API keys through the Settings UI!

## Support

For issues with Supabase, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
