# API Key Management - Quick Reference

## 🚀 Quick Start (30 seconds)

1. Click the **Settings icon (⚙️)** in the header
2. Fill in:
   - **Key Name**: "My API Key"
   - **Service**: "api-football"
   - **API Key Value**: Paste your key here
3. Click **"Add API Key"**
4. Done! The app will use this key automatically

## 📍 Where to Find It

- **Settings Button**: Top right of header (⚙️)
- **Keyboard**: No shortcut (use UI)
- **Mobile**: Works on all devices

## 🔑 Where API Keys Come From

### API-Football
1. Go to [api-football on RapidAPI](https://rapidapi.com/api-sports/api/api-football)
2. Click "Subscribe to Test" (free tier available)
3. Go to "Code Snippets" section
4. Copy the `x-rapidapi-key` header value
5. Add to app via Settings UI

### OpenAI, Stripe, GitHub
- Visit respective service websites
- Generate API key in settings/dashboard
- Copy key to Settings UI

## ✅ How It Works

```
Add Key via Settings UI
    ↓
Encrypts & stores in Supabase
    ↓
App checks Environment Variable first
    ↓
If not found, fetches from Supabase
    ↓
Uses key for API requests
```

## 🛡️ Security

- ✅ Keys encrypted in Supabase
- ✅ Only you can access your keys
- ✅ Masked in UI (shows only first/last 4 chars)
- ✅ HTTPS encrypted transmission
- ✅ No logging of key values

## 📋 Available Actions

| Action | How | When |
|--------|-----|------|
| **Add Key** | Click "Add API Key" button | Always |
| **View Key** | Click eye icon | See masked value |
| **Copy Key** | Click copy icon | Share with team |
| **Hide Key** | Click eye icon again | Security |
| **Delete Key** | Click trash icon | No longer needed |

## 🔄 Priority System

The app uses API keys in this order:

1. **Environment Variable** (.env.local)
   ```
   VITE_RAPID_API_KEY=your-key-here
   ```

2. **Supabase** (fallback)
   - Added via Settings UI
   - Used if env var not set

3. **Error**
   - If neither available

**Result**: You can use either or both!

## ⚙️ Settings Dialog Features

### Left Column
- Key name
- Service dropdown
- API key value input
- Metadata (optional JSON)
- Add button

### Right Column (List)
- All your stored keys
- Service badges
- Active/Inactive status
- Actions (show/copy/delete)
- Dates (created, last used)

## 🐛 Troubleshooting

### "API key not found" Error
**Solution**: Add key via Settings UI or set `VITE_RAPID_API_KEY`

### "Failed to load API keys" in Settings
**Solution**: Check if you're logged in to Supabase

### Key shows as "Inactive"
**Solution**: Delete and re-add the key

### Can't see Settings icon
**Solution**: Look in top-right corner next to user/bell icons

## 💡 Tips & Tricks

### Multiple Keys
- Add production and staging keys
- Add metadata to distinguish them
- Delete unused keys when done

### Metadata Examples
```json
{"plan": "free", "limit": 100}
{"environment": "production"}
{"service": "api-football", "tier": "pro"}
```

### Copy to Clipboard
- Click copy icon
- Icon changes to checkmark
- Auto-copies to clipboard
- Paste into needed locations

## 🚦 Status Indicators

**Active** (Green badge)
- Key is ready to use
- Will be used by the app

**Inactive** (Gray badge)
- Key won't be used
- Delete and re-add to activate

## 📱 Mobile Support

- ✅ Full support on mobile
- ✅ Touch-friendly buttons
- ✅ All features work
- ✅ Responsive dialog

## 🔗 Related Documents

- **[Full Guide](./SUPABASE_API_KEY_BACKUP.md)** - Comprehensive documentation
- **[Implementation Details](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[API Integration](./API_INTEGRATION_GUIDE.md)** - How API keys are used

## 🆘 Need Help?

1. **Check Settings UI** - It has helpful tooltips
2. **Read Full Guide** - `SUPABASE_API_KEY_BACKUP.md`
3. **Check Browser Console** - Error messages help debug
4. **Verify Supabase** - Ensure authentication is working

---

**Quick Tip**: Your API keys are safe! They're encrypted in Supabase and only you can access them.
