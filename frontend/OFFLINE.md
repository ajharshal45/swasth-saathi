# Offline Functionality Guide

## Overview
Swasth Saathi is now fully configured to work offline without internet. All pages and features function using cached data and localStorage.

## How It Works

### 1. Service Worker (PWA)
- **Automatic caching** of all pages during first visit
- **CacheFirst strategy** for reliable offline access
- **Workbox** manages the service worker lifecycle

### 2. Cached Pages
All essential pages are cached automatically:
- `/` - Homepage
- `/symptoms` - Symptom selection
- `/questions` - Health questions
- `/result` - Triage results
- `/pathway` - Care guidance
- `/doctor` - Doctor review page
- `/_offline` - Offline fallback page

### 3. Data Storage
- **LocalStorage** stores all user data:
  - Selected symptoms
  - Age group, duration, severity
  - Medical conditions and medicine taken
  - Triage results
  - Language preference
- **JSON files** (symptom groups, triage rules) are cached by service worker

### 4. Network Status
- Real-time online/offline indicator on all pages
- Green badge = Online
- Red badge = Offline

## Building for Production

### Development Mode
```bash
npm run dev
```
Note: Service worker is **disabled** in development to avoid caching issues.

### Production Build
```bash
npm run build
npm start
```
Service worker is **active** in production and will cache all assets.

## Testing Offline Functionality

### Method 1: Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Click "Service Workers" in sidebar
4. Check "Offline" checkbox
5. Refresh the page - it should still work!

### Method 2: Network Tab
1. Open Chrome DevTools (F12)
2. Go to "Network" tab
3. Select "Offline" from throttling dropdown
4. Navigate through the app

### Method 3: Airplane Mode
1. Build and deploy the app
2. Visit the site once while online
3. Enable airplane mode on your device
4. Navigate through the app - everything works!

## What Works Offline?

### ✅ Fully Functional
- Symptom selection (all symptoms available)
- Health questionnaire
- Triage calculation (risk assessment)
- Care pathway guidance
- Language switching (English/Hindi)
- Doctor page data display
- All navigation between pages
- All UI interactions

### ⚠️ Limited When Offline
- Cannot submit to external APIs (if implemented)
- Cannot fetch new data from server
- Cannot sync with backend database

## Cache Management

### Cache Duration
- **Pages**: 24 hours
- **Static assets (JS/CSS)**: 7 days
- **Images**: 7 days
- **JSON data files**: 7 days

### Manual Cache Clear
Users can clear cache by:
1. Chrome Settings → Privacy → Clear browsing data
2. Or unregister service worker in DevTools

### Automatic Updates
When user comes online:
- Service worker checks for updates
- New version installs in background
- Updates activate on next page load

## Technical Details

### PWA Configuration
File: `next.config.js`
- Uses `next-pwa` package
- Runtime caching strategies defined
- Fallback to `/_offline` page

### Service Worker Registration
File: `pages/_app.js`
- Registers service worker on mount
- Handles update events
- Logs all service worker activities

### Manifest
File: `public/manifest.json`
- Defines app metadata
- Icons for home screen install
- Shortcuts to key features

## Troubleshooting

### Service Worker Not Working?
1. Check if running in production mode (`npm start`, not `npm run dev`)
2. Check browser console for service worker errors
3. Ensure HTTPS or localhost (service workers require secure context)

### Cache Not Updating?
1. Unregister service worker in DevTools
2. Clear site data
3. Hard refresh (Ctrl+Shift+R)

### Pages Not Loading Offline?
1. Visit all pages at least once while online (to cache them)
2. Check Network tab to ensure pages are cached
3. Verify service worker is active in DevTools

## Deployment Checklist

- [x] Service worker configured
- [x] All pages use localStorage for data persistence
- [x] Network status indicator on all pages
- [x] Offline fallback page created
- [x] PWA manifest with icons
- [x] CacheFirst strategy for all essential resources
- [x] JSON data files cached
- [x] Static assets cached

## Browser Support

### Full Support
- Chrome/Edge 90+
- Firefox 85+
- Safari 15+
- Android Chrome
- iOS Safari 15+

### Service Worker Requirement
All modern browsers support service workers and PWAs.

## Benefits

1. **Works in rural areas** with poor connectivity
2. **Instant loading** after first visit
3. **No data usage** for cached content
4. **Reliable** - works even when server is down
5. **Fast** - no network latency for cached resources

---

**Swasth Saathi** - Healthcare guidance that works, even without internet! 🏥📴✨
