-- Create table for storing API keys securely in Supabase (optional backup)
-- This allows you to store and manage API keys centrally if needed

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(255) NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  service VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB
);

-- Enable RLS (Row Level Security)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy: only authenticated users can view their own keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  USING (auth.uid() = created_by OR auth.role() = 'authenticated');

-- Create policy: only authenticated users can insert their own keys
CREATE POLICY "Users can insert their own API keys"
  ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Create policy: only authenticated users can update their own keys
CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Create policy: only authenticated users can delete their own keys
CREATE POLICY "Users can delete their own API keys"
  ON api_keys
  FOR DELETE
  USING (auth.uid() = created_by);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS api_keys_service_idx ON api_keys(service);
CREATE INDEX IF NOT EXISTS api_keys_created_by_idx ON api_keys(created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_keys_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS api_keys_updated_at_trigger ON api_keys;
CREATE TRIGGER api_keys_updated_at_trigger
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_api_keys_timestamp();

-- Example: Insert API-Football key (you'll need to do this manually or through a function)
-- INSERT INTO api_keys (key_name, key_value, service, created_by, metadata)
-- VALUES ('api-football-key', 'your_api_key_here', 'api-football', auth.uid(), '{"plan": "free", "limit": 100}');
