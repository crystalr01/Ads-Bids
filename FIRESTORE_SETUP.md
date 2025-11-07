# Firestore Database Setup - REQUIRED

## The Problem
You're seeing 400 errors because Firestore Database doesn't exist in your Firebase project yet.

## Solution: Create Firestore Database

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **dazzle-b3038**

### Step 2: Create Firestore Database
1. In the left sidebar, click **Build** → **Firestore Database**
2. Click **"Create database"** button
3. **Select Mode:**
   - Choose **"Start in production mode"** (we have security rules ready)
   - Click **Next**

4. **Select Location:**
   - Choose a location closest to your users (e.g., asia-south1 for India)
   - Click **Enable**

5. Wait for database creation (takes 1-2 minutes)

### Step 3: Deploy Security Rules
After database is created, deploy the security rules:

```bash
# Make sure you're in the project directory
cd "d:/ongoing/Ad Bids"

# Login to Firebase (if not already)
firebase login

# Initialize Firebase (if not already done)
firebase init

# When prompted:
# - Select: Firestore, Storage, Hosting
# - Use existing project: dazzle-b3038
# - Accept all default file names
# - Type 'n' when asked to overwrite files

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

### Step 4: Enable Authentication
1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Click on **"Email/Password"** under Sign-in method
4. Toggle **Enable** to ON
5. Click **Save**

### Step 5: Set up Storage
1. In Firebase Console, go to **Build** → **Storage**
2. Click **"Get started"**
3. Choose **"Start in production mode"**
4. Select the **same location** as Firestore
5. Click **Done**

### Step 6: Restart Dev Server
After completing all steps above:

```bash
# Stop the dev server (Ctrl+C)
# Then restart it
npm run dev
```

## Verification

After setup, you should be able to:
1. ✅ Open http://localhost:3000 without errors
2. ✅ Sign up a new user
3. ✅ Login successfully
4. ✅ See the dashboard

## Common Issues

### Issue: "firebase: command not found"
**Solution:**
```bash
npm install -g firebase-tools
```

### Issue: "Permission denied"
**Solution:**
```bash
firebase login
```

### Issue: Still getting 400 errors
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check Firebase Console that Firestore is showing "Cloud Firestore" with data tab

### Issue: "Project not found"
**Solution:**
Make sure you're using the correct project:
```bash
firebase use dazzle-b3038
```

## Quick Checklist

- [ ] Firestore Database created in Firebase Console
- [ ] Authentication enabled (Email/Password)
- [ ] Storage enabled
- [ ] Firebase CLI installed (`firebase --version`)
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Indexes deployed (`firebase deploy --only firestore:indexes`)
- [ ] Storage rules deployed (`firebase deploy --only storage`)
- [ ] Dev server restarted

## What Each Service Does

**Firestore Database**: Stores user data, ads, and view records
**Authentication**: Manages user login/signup
**Storage**: Stores ad images
**Hosting**: Deploys your web app (optional for now)

---

**IMPORTANT**: You MUST create the Firestore Database in Firebase Console before the app will work!
