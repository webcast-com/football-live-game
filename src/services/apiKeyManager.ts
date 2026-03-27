import { supabase } from '@/lib/supabase';

export interface ApiKey {
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

/**
 * API Key Manager - Manages API keys stored in Supabase
 * Optional utility for backing up and managing API keys centrally
 */
export class ApiKeyManager {
  /**
   * Get API key from environment or Supabase backup
   * @param serviceName The service name (e.g., 'api-football')
   * @returns The API key or null if not found
   */
  static async getApiKey(serviceName: string): Promise<string | null> {
    // First, try to get from environment variables
    const envKey = this.getFromEnvironment(serviceName);
    if (envKey) {
      return envKey;
    }

    // Fall back to Supabase if available
    try {
      return await this.getFromSupabase(serviceName);
    } catch (error) {
      console.warn(`Failed to fetch API key from Supabase: ${error}`);
      return null;
    }
  }

  /**
   * Get API key from environment variables
   */
  private static getFromEnvironment(serviceName: string): string | null {
    const envVarName = `VITE_${serviceName.toUpperCase().replace(/-/g, '_')}_KEY`;
    return import.meta.env[envVarName] || null;
  }

  /**
   * Get API key from Supabase (requires authentication)
   */
  private static async getFromSupabase(serviceName: string): Promise<string | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('service', serviceName)
        .eq('is_active', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update last_used_at
      if (data) {
        await supabase
          .from('api_keys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('key_value', data.key_value);
      }

      return data?.key_value || null;
    } catch (error) {
      console.error(`Failed to fetch API key from Supabase:`, error);
      return null;
    }
  }

  /**
   * Store API key in Supabase (requires authentication)
   */
  static async storeApiKey(
    serviceName: string,
    keyValue: string,
    keyName?: string,
    metadata?: Record<string, any>
  ): Promise<ApiKey | null> {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          key_name: keyName || `${serviceName}-key`,
          key_value: keyValue,
          service: serviceName,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error(`Failed to store API key in Supabase:`, error);
      return null;
    }
  }

  /**
   * Update API key in Supabase
   */
  static async updateApiKey(
    serviceName: string,
    newKeyValue: string,
    metadata?: Record<string, any>
  ): Promise<ApiKey | null> {
    if (!supabase) {
      console.error('Supabase client not available');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          key_value: newKeyValue,
          ...(metadata && { metadata }),
          updated_at: new Date().toISOString(),
        })
        .eq('service', serviceName)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error(`Failed to update API key in Supabase:`, error);
      return null;
    }
  }

  /**
   * Delete API key from Supabase
   */
  static async deleteApiKey(serviceName: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase client not available');
      return false;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('service', serviceName);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete API key from Supabase:`, error);
      return false;
    }
  }

  /**
   * Deactivate API key (soft delete)
   */
  static async deactivateApiKey(serviceName: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase client not available');
      return false;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('service', serviceName);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error(`Failed to deactivate API key in Supabase:`, error);
      return false;
    }
  }

  /**
   * List all API keys for current user
   */
  static async listApiKeys(): Promise<ApiKey[]> {
    if (!supabase) {
      console.error('Supabase client not available');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error(`Failed to list API keys from Supabase:`, error);
      return [];
    }
  }
}

export default ApiKeyManager;
