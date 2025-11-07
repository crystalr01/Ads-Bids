# Quick Setup Guide

Follow these steps to get your Ad Bids Platform up and running.

## Step 1: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

## Step 2: Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "ad-bids-platform")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 3: Enable Firebase Services

### Enable Authentication
1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Click on "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

### Create Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (closest to your users)
5. Click "Enable"

### Set up Storage
1. Go to **Build** → **Storage**
2. Click "Get started"
3. Accept default rules
4. Choose same location as Firestore
5. Click "Done"

### Set up Hosting
1. Go to **Build** → **Hosting**
2. Click "Get started"
3. Follow the prompts (we'll deploy later)

## Step 4: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register app with a nickname (e.g., "Ad Bids Web")
6. Copy the `firebaseConfig` object

## Step 5: Update Firebase Configuration

Open `src/firebase/config.js` and replace the configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Paste your actual values from Firebase Console.

## Step 6: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 7: Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

## Step 8: Initialize Firebase

```bash
firebase init
```

When prompted:
- Select: **Firestore**, **Storage**, and **Hosting**
- Use an existing project: Select your project
- Firestore rules file: Press Enter (use default `firestore.rules`)
- Firestore indexes file: Press Enter (use default `firestore.indexes.json`)
- Storage rules file: Press Enter (use default `storage.rules`)
- Public directory: Type `dist` and press Enter
- Configure as single-page app: Type `y` and press Enter
- Set up automatic builds: Type `n` and press Enter
- Overwrite files: Type `n` for all (we already have the files)

## Step 9: Deploy Firebase Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

Wait for deployment to complete. You may see a message about creating indexes - this is normal.

## Step 10: Run Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:3000`

## Step 11: Test the Application

### Test Advertiser Flow
1. Click "Sign Up"
2. Enter email and password
3. Select "Advertiser" role
4. Create account
5. Click "Create New Ad"
6. Fill in ad details:
   - Title: "Test Ad"
   - Description: "This is a test advertisement"
   - Target Link: "https://example.com"
   - Bid Per View: 0.20
   - Total Budget: 100
   - Upload an image
7. Click "Create Ad"
8. Verify ad appears in dashboard

### Test Viewer Flow
1. Logout from advertiser account
2. Sign up with a different email
3. Select "Viewer" role
4. Verify you see the ad created by advertiser
5. Copy the share link
6. Open the link in a new incognito/private window
7. Verify:
   - View is recorded
   - Earnings increase
   - Redirect happens after countdown

## Step 12: Deploy to Firebase Hosting (Optional)

When ready to deploy:

```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

## Troubleshooting

### Issue: "Missing or insufficient permissions"
**Solution**: Make sure you deployed Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### Issue: "Storage upload failed"
**Solution**: Deploy storage rules:
```bash
firebase deploy --only storage
```

### Issue: "Index required" error
**Solution**: Click the link in the error message to create the index automatically, or run:
```bash
firebase deploy --only firestore:indexes
```

### Issue: Port 3000 already in use
**Solution**: Either:
- Stop the other process using port 3000
- Or change the port in `vite.config.js`

### Issue: Build fails
**Solution**: Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Customize Branding**: Update colors, logo, and text
2. **Add Payment Integration**: Integrate payment gateway for withdrawals
3. **Set up Analytics**: Add Google Analytics or Firebase Analytics
4. **Configure Domain**: Add custom domain in Firebase Hosting
5. **Enable HTTPS**: Firebase Hosting provides SSL automatically

## Important Notes

- **Security**: Never commit your Firebase config with real credentials to public repositories
- **Indexes**: Some Firestore queries may require composite indexes. Firebase will provide links to create them.
- **Budget**: Monitor Firebase usage to stay within free tier limits
- **Testing**: Test thoroughly before deploying to production

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Firebase Console for service status
3. Review the README.md for detailed documentation
4. Check Firestore rules are properly deployed

---

Happy coding! 🚀
