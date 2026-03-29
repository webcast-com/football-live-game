import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Eye, EyeOff, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKeyManager, type ApiKey } from '@/services/apiKeyManager';

const ApiKeyManagerComponent: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showValues, setShowValues] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [keyName, setKeyName] = useState('');
  const [keyValue, setKeyValue] = useState('');
  const [serviceName, setServiceName] = useState('api-football');
  const [metadata, setMetadata] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const services = [
    { value: 'api-football', label: 'API-Football (RapidAPI)' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'github', label: 'GitHub' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    if (open) {
      loadKeys();
    }
  }, [open]);

  const loadKeys = async () => {
    setLoading(true);
    try {
      const apiKeys = await ApiKeyManager.listApiKeys();
      setKeys(apiKeys);
      setError(null);
    } catch (err) {
      setError('Failed to load API keys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!keyName || !keyValue || !serviceName) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const newKey = await ApiKeyManager.storeApiKey(
        serviceName,
        keyValue,
        keyName,
        metadata ? JSON.parse(metadata) : undefined
      );

      if (newKey) {
        setKeys([newKey, ...keys]);
        setKeyName('');
        setKeyValue('');
        setMetadata('');
        setSuccess('API key added successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to store API key');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteKey = async (keyId: string, serviceName: string) => {
    if (!confirm(`Are you sure you want to delete the ${serviceName} API key?`)) {
      return;
    }

    try {
      const success = await ApiKeyManager.deleteApiKey(serviceName);
      if (success) {
        setKeys(keys.filter((k) => k.id !== keyId));
        setSuccess('API key deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete API key');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const toggleShowValue = (keyId: string) => {
    setShowValues((prev) => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const copyToClipboard = (value: string, keyId: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(keyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative group">
          <Settings className="w-5 h-5" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            API Key Manager
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#161b22] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Key Manager
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your API keys securely. Keys are stored in Supabase with row-level security.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alerts */}
          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500/20 bg-green-500/10">
              <Check className="w-4 h-4 text-green-400" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          {/* Add new key section */}
          <div className="border border-white/10 rounded-lg p-4 bg-white/5">
            <h3 className="text-white font-semibold mb-4">Add New API Key</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Key Name</Label>
                  <Input
                    placeholder="e.g., API-Football Production"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="mt-1 bg-[#0d1117] border-white/10 text-white placeholder-gray-600"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Service</Label>
                  <select
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-md text-white text-sm focus:outline-none focus:border-[#00d4ff]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">API Key Value</Label>
                <Input
                  type="password"
                  placeholder="Paste your API key here"
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  className="mt-1 bg-[#0d1117] border-white/10 text-white placeholder-gray-600"
                />
              </div>

              <div>
                <Label className="text-gray-300 text-xs">Metadata (Optional, JSON format)</Label>
                <textarea
                  placeholder='{"plan": "free", "limit": 100}'
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-[#0d1117] border border-white/10 rounded-md text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#00d4ff]/50 resize-none h-20"
                />
              </div>

              <Button
                onClick={handleAddKey}
                disabled={submitting}
                className="w-full bg-[#00d4ff] text-black hover:bg-[#00d4ff]/90 font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add API Key
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Keys list section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stored API Keys</h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-[#00d4ff] animate-spin" />
                <span className="ml-2 text-gray-400">Loading keys...</span>
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center py-8 border border-white/5 rounded-lg bg-white/5">
                <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No API keys stored yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{key.key_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-xs uppercase bg-white/5 px-2 py-1 rounded">
                          {key.service}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${key.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-gray-600 text-xs">
                          Added {new Date(key.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <p className="text-gray-400 text-xs font-mono">
                          {showValues.has(key.id) ? key.key_value : maskValue(key.key_value)}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleShowValue(key.id)}
                        className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        title={showValues.has(key.id) ? 'Hide' : 'Show'}
                      >
                        {showValues.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => copyToClipboard(key.key_value, key.id)}
                        className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Copy to clipboard"
                      >
                        {copiedId === key.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDeleteKey(key.id, key.service)}
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info box */}
          <Alert className="border-blue-500/20 bg-blue-500/10">
            <AlertCircle className="w-4 h-4 text-blue-400" />
            <AlertDescription className="text-blue-400 text-sm">
              Your API keys are encrypted and stored in Supabase with row-level security. Only you can access them. Environment variables take precedence over stored keys.
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManagerComponent;
