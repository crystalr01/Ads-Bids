# Quick Command Reference

## Installation

```bash
# Install dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

## Development

```bash
# Start development server
npm run dev

# Development server will run at http://localhost:3000
```

## Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage

# Deploy all Firebase services
firebase deploy
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Build and deploy in one command
npm run deploy
```

## Testing

```bash
# Run development server for testing
npm run dev

# Test in different browsers:
# - Chrome: http://localhost:3000
# - Firefox: http://localhost:3000
# - Safari: http://localhost:3000
```

## Troubleshooting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Firebase project status
firebase projects:list

# View Firebase logs
firebase functions:log

# Check Firestore indexes
firebase firestore:indexes

# Serve locally with Firebase hosting
firebase serve
```

## Git Commands (if using version control)

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Ad Bids Platform"

# Add remote repository
git remote add origin YOUR_REPO_URL

# Push to remote
git push -u origin main
```

## Useful Firebase Console Links

- **Firebase Console**: https://console.firebase.google.com/
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
- **Storage**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage
- **Hosting**: https://console.firebase.google.com/project/YOUR_PROJECT_ID/hosting

## Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your Firebase config
# (Note: For Vite, use VITE_ prefix for environment variables)
```

## Package Management

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install package-name

# Uninstall package
npm uninstall package-name

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Development Tips

```bash
# Run with specific port
npm run dev -- --port 3001

# Clear Vite cache
rm -rf node_modules/.vite

# Check bundle size
npm run build -- --mode production

# Analyze bundle
npm run build -- --mode production --report
```

## Firebase Emulator (Optional)

```bash
# Install emulators
firebase init emulators

# Start emulators
firebase emulators:start

# Start specific emulator
firebase emulators:start --only firestore
firebase emulators:start --only auth
firebase emulators:start --only storage
```

## Common Issues & Fixes

### Port already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Firebase permission errors
```bash
# Re-login to Firebase
firebase logout
firebase login

# Check current project
firebase projects:list
firebase use YOUR_PROJECT_ID
```

### Build errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist .vite
npm install
npm run build
```

## Quick Start (Complete Setup)

```bash
# 1. Install dependencies
npm install

# 2. Update Firebase config in src/firebase/config.js

# 3. Login and initialize Firebase
firebase login
firebase init

# 4. Deploy Firebase rules
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000 in browser
```

## Production Deployment

```bash
# 1. Test locally
npm run dev

# 2. Build for production
npm run build

# 3. Test production build
npm run preview

# 4. Deploy to Firebase
firebase deploy --only hosting

# 5. Access your live site at:
# https://YOUR_PROJECT_ID.web.app
```

---

For detailed instructions, see:
- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Step-by-step setup
- **PROJECT_SUMMARY.md** - Technical overview
