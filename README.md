# 🎯 Ad Bids Platform

A Firebase-based web application that connects advertisers with viewers through a transparent, bid-based advertising platform. Advertisers create ads with custom budgets and bids, while viewers earn money by sharing unique links that track views per device.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### For Advertisers
- **Create Ads**: Upload images, set titles, descriptions, and target links
- **Flexible Bidding**: Set your own bid per view (e.g., ₹0.20 per view)
- **Budget Control**: Define total budget (e.g., ₹100 for 500 views)
- **Real-time Tracking**: Monitor views, spending, and remaining budget
- **Automatic Management**: Ads automatically deactivate when budget is exhausted

### For Viewers
- **Earn Money**: Get paid for each unique view generated
- **Unique Share Links**: Each viewer gets a unique link for the highest-paying ad
- **Device Tracking**: One view per device using fingerprinting technology
- **Instant Updates**: Earnings update automatically after each view
- **Simple Dashboard**: Track total earnings and views

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase
  - Authentication (Email/Password)
  - Firestore Database
  - Storage (for ad images)
  - Hosting
- **Device Fingerprinting**: FingerprintJS
- **Routing**: React Router v6

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Firebase CLI (`npm install -g firebase-tools`)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd "d:/ongoing/Ad Bids"
npm install
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication**: Enable Email/Password sign-in method
   - **Firestore Database**: Create in production mode
   - **Storage**: Set up with default rules
   - **Hosting**: Initialize hosting

### 3. Get Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Scroll down to "Your apps" section
3. Click on the web icon (</>) to create a web app
4. Copy the Firebase configuration object

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `src/firebase/config.js` with your Firebase configuration:
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

### 5. Deploy Firestore Rules and Indexes

```bash
firebase login
firebase init
# Select Firestore, Storage, and Hosting
# Use existing project
# Accept default files

firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

Or use the combined command:

```bash
npm run deploy
```

### Deploy to Vercel

This project includes a `vercel.json` configuration file that handles SPA routing. This ensures that:
- Direct URL access to any route works correctly
- Page refreshes don't cause 404 errors
- Shared links (e.g., `/view/:adId/:viewerId`) open properly

To deploy to Vercel:
1. Push your code to GitHub
2. Import the project in Vercel dashboard
3. Vercel will automatically detect the Vite configuration and deploy

**Note**: The `vercel.json` file redirects all routes to `index.html`, allowing React Router to handle client-side routing.

## Project Structure

```
Ad Bids/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Advertiser/
│   │   │   ├── AdvertiserDashboard.jsx
│   │   │   └── CreateAdModal.jsx
│   │   ├── Viewer/
│   │   │   ├── ViewerDashboard.jsx
│   │   │   └── AdView.jsx
│   │   └── LandingPage.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── firebase.json
├── vercel.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
└── README.md
```

## Database Schema

### Users Collection
```javascript
{
  email: string,
  role: "advertiser" | "viewer",
  createdAt: string (ISO),
  earnings: number (viewers only)
}
```

### Ads Collection
```javascript
{
  advertiserId: string,
  title: string,
  description: string,
  imageUrl: string,
  targetLink: string,
  bidPerView: number,
  totalBudget: number,
  remainingBudget: number,
  viewCount: number,
  isActive: boolean,
  createdAt: string (ISO)
}
```

### Views Collection
```javascript
{
  adId: string,
  viewerId: string,
  deviceId: string,
  timestamp: string (ISO)
}
```

## How It Works

### Advertiser Flow
1. Sign up with email/password and select "Advertiser" role
2. Create an ad with:
   - Title and description
   - Image upload
   - Target link (where viewers will be redirected)
   - Bid per view (e.g., ₹0.20)
   - Total budget (e.g., ₹100)
3. Ad is automatically activated and shown to viewers
4. Track views and spending in real-time
5. Ad automatically deactivates when budget is exhausted

### Viewer Flow
1. Sign up with email/password and select "Viewer" role
2. See the highest-paying active ad on dashboard
3. Copy unique share link for the ad
4. Share link on social media, forums, etc.
5. Earn money for each unique device that clicks the link
6. Track earnings and total views in dashboard

### View Tracking
1. When someone clicks a viewer's share link:
   - Device fingerprint is generated using FingerprintJS
   - System checks if this device has already viewed this ad from this viewer
   - If new view:
     - View is recorded in database
     - Viewer earnings increase by bid amount
     - Advertiser's remaining budget decreases
     - Ad view count increases
   - If duplicate view:
     - User sees "already viewed" message
     - No money is transferred

## Security Features

- **Authentication**: Firebase Authentication with email/password
- **Firestore Rules**: Role-based access control
- **Storage Rules**: Users can only upload to their own folders
- **Device Fingerprinting**: Prevents duplicate views from same device
- **Unique Links**: Each viewer gets unique tracking links

## Firestore Security Rules

The app uses comprehensive security rules to protect data:

- Users can only read/write their own user document
- Advertisers can only create/update/delete their own ads
- Views are write-once (cannot be updated or deleted)
- All operations require authentication

## Performance Optimizations

- **Composite Indexes**: Optimized queries for ad selection
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Firebase Storage with CDN
- **Real-time Updates**: Efficient Firestore listeners

## Troubleshooting

### 404 Errors on Vercel Deployment
If you get 404 errors when:
- Opening shared links (`/view/:adId/:viewerId`)
- Accessing `/login` or other routes directly
- Refreshing the page on any route

**Solution**: Ensure `vercel.json` exists in the project root with the SPA routing configuration. This file redirects all routes to `index.html` so React Router can handle routing.

### Firestore Index Errors
If you see index errors in the console, Firebase will provide a link to create the required index automatically.

### Storage Upload Errors
Ensure Storage rules are deployed:
```bash
firebase deploy --only storage
```

### Authentication Errors
Verify that Email/Password authentication is enabled in Firebase Console.

### Build Errors
Clear cache and reinstall dependencies:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Future Enhancements

- Payment gateway integration for withdrawals
- Advanced analytics dashboard
- Ad performance metrics
- Multiple ad formats (video, carousel)
- Geolocation targeting
- A/B testing for ads
- Referral system
- Admin panel

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using React, Firebase, and Tailwind CSS
