# Ad Bids Platform - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Landing    │  │    Login     │  │   Signup     │     │
│  │     Page     │  │     Page     │  │     Page     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │  Auth Context  │                       │
│                    │  (User State)  │                       │
│                    └───────┬────────┘                       │
│                            │                                │
│              ┌─────────────┴─────────────┐                 │
│              │                           │                 │
│    ┌─────────▼──────────┐    ┌──────────▼─────────┐      │
│    │    Advertiser      │    │      Viewer        │      │
│    │    Dashboard       │    │    Dashboard       │      │
│    │                    │    │                    │      │
│    │  - Create Ads      │    │  - View Top Ad     │      │
│    │  - Manage Ads      │    │  - Share Links     │      │
│    │  - Track Stats     │    │  - Track Earnings  │      │
│    └────────────────────┘    └────────────────────┘      │
│                                      │                     │
│                            ┌─────────▼─────────┐          │
│                            │   Ad View Page    │          │
│                            │  (Public Access)  │          │
│                            └───────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Firebase SDK
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                      FIREBASE BACKEND                      │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │     Auth     │  │   Firestore  │  │   Storage    │   │
│  │              │  │              │  │              │   │
│  │ - Email/Pass │  │ - Users      │  │ - Ad Images  │   │
│  │ - Sessions   │  │ - Ads        │  │ - CDN        │   │
│  │              │  │ - Views      │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                            │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │   Hosting    │  │    Rules     │                      │
│  │              │  │              │                      │
│  │ - Static     │  │ - Security   │                      │
│  │ - SPA        │  │ - Access     │                      │
│  └──────────────┘  └──────────────┘                      │
└────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Registration Flow

```
User → Signup Form → Firebase Auth → Create User Doc → Firestore
                                           │
                                           ├─ role: "advertiser"
                                           ├─ email: "user@example.com"
                                           ├─ createdAt: timestamp
                                           └─ earnings: 0 (if viewer)
```

### 2. Ad Creation Flow (Advertiser)

```
Advertiser → Create Ad Form → Upload Image → Firebase Storage
                    │                              │
                    │                              ▼
                    │                         Get Image URL
                    │                              │
                    └──────────────────────────────┘
                                   │
                                   ▼
                            Create Ad Document
                                   │
                                   ▼
                              Firestore (ads)
                    ┌──────────────┴──────────────┐
                    │                             │
                    ├─ advertiserId               │
                    ├─ title                      │
                    ├─ description                │
                    ├─ imageUrl                   │
                    ├─ targetLink                 │
                    ├─ bidPerView: 0.20          │
                    ├─ totalBudget: 100          │
                    ├─ remainingBudget: 100      │
                    ├─ viewCount: 0              │
                    ├─ isActive: true            │
                    └─ createdAt: timestamp       │
                                   │
                                   ▼
                          Dashboard Updated
```

### 3. View Processing Flow

```
User Clicks Share Link
         │
         ▼
   Ad View Page
         │
         ├─ Generate Device Fingerprint (FingerprintJS)
         │
         ▼
   Check Firestore
         │
         ├─ Query: adId + viewerId + deviceId
         │
         ▼
   Already Viewed?
         │
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │         ▼
    │    Record View
    │         │
    │         ├─ Add to views collection
    │         │
    │         ├─ Update Ad:
    │         │   • viewCount + 1
    │         │   • remainingBudget - bidPerView
    │         │   • isActive = false (if budget exhausted)
    │         │
    │         ├─ Update Viewer:
    │         │   • earnings + bidPerView
    │         │
    │         ▼
    │    Show Success
    │         │
    └─────────┴─────────┐
                        │
                        ▼
                 Redirect to Target Link
```

### 4. Highest Bid Selection Flow

```
Viewer Dashboard Loads
         │
         ▼
   Query Firestore
         │
         ├─ WHERE isActive = true
         ├─ WHERE remainingBudget > 0
         ├─ ORDER BY bidPerView DESC
         └─ LIMIT 1
         │
         ▼
   Get Top Ad
         │
         ├─ Display Ad Details
         ├─ Generate Unique Link
         └─ Show Share Options
```

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── LandingPage
│       │   ├── Header
│       │   ├── Hero Section
│       │   ├── Features Grid
│       │   └── Footer
│       │
│       ├── Login
│       │   └── Login Form
│       │
│       ├── Signup
│       │   └── Signup Form (with role selection)
│       │
│       ├── PrivateRoute
│       │   └── DashboardRouter
│       │       ├── AdvertiserDashboard (if role = advertiser)
│       │       │   ├── Header
│       │       │   ├── Stats Cards
│       │       │   ├── Create Ad Button
│       │       │   ├── Ads List
│       │       │   └── CreateAdModal
│       │       │       └── Ad Form
│       │       │
│       │       └── ViewerDashboard (if role = viewer)
│       │           ├── Header
│       │           ├── Stats Cards
│       │           ├── Top Ad Display
│       │           ├── Share Link Section
│       │           └── How It Works
│       │
│       └── AdView (Public)
│           ├── Loading State
│           ├── Success State
│           ├── Error State
│           └── Already Viewed State
```

## Database Schema

### Collections Structure

```
firestore
│
├── users (collection)
│   └── {userId} (document)
│       ├── email: string
│       ├── role: "advertiser" | "viewer"
│       ├── createdAt: timestamp
│       └── earnings: number (viewers only)
│
├── ads (collection)
│   └── {adId} (document)
│       ├── advertiserId: string (ref to users)
│       ├── title: string
│       ├── description: string
│       ├── imageUrl: string (Storage URL)
│       ├── targetLink: string
│       ├── bidPerView: number
│       ├── totalBudget: number
│       ├── remainingBudget: number
│       ├── viewCount: number
│       ├── isActive: boolean
│       └── createdAt: timestamp
│
└── views (collection)
    └── {viewId} (document)
        ├── adId: string (ref to ads)
        ├── viewerId: string (ref to users)
        ├── deviceId: string (fingerprint)
        └── timestamp: timestamp
```

## Security Model

```
┌─────────────────────────────────────────────────────┐
│                  Security Layers                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  1. Firebase Authentication                         │
│     └─ Email/Password verification                  │
│                                                      │
│  2. Firestore Security Rules                        │
│     ├─ Users: Own data only                         │
│     ├─ Ads: Advertiser owns their ads               │
│     └─ Views: Write-once, no updates                │
│                                                      │
│  3. Storage Security Rules                          │
│     ├─ Read: Public                                 │
│     └─ Write: Own folder only                       │
│                                                      │
│  4. Application Logic                               │
│     ├─ Role-based routing                           │
│     ├─ Device fingerprinting                        │
│     └─ Duplicate view prevention                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Request Flow Examples

### Example 1: Advertiser Creates Ad

```
1. User fills form → Validates input
2. Uploads image → Firebase Storage
3. Gets image URL → Creates Firestore document
4. Firestore triggers → Updates dashboard
5. Real-time listener → UI updates automatically
```

### Example 2: Viewer Shares Link

```
1. Viewer opens dashboard → Queries top ad
2. Generates unique link → Copies to clipboard
3. Shares on social media → Others click link
4. AdView page loads → Generates fingerprint
5. Checks for duplicate → Processes view
6. Updates earnings → Redirects to target
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                  │
│  React Components + Tailwind CSS + Lucide       │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Application Layer                   │
│  React Router + Context API + Hooks             │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Service Layer                       │
│  Firebase SDK + FingerprintJS                   │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│              Backend Layer                       │
│  Firebase Auth + Firestore + Storage            │
└─────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌────────────────────────────────────────────────┐
│              Developer Machine                  │
│                                                │
│  npm run build → dist/ folder                 │
└────────────────┬───────────────────────────────┘
                 │
                 │ firebase deploy
                 │
┌────────────────▼───────────────────────────────┐
│           Firebase Hosting                     │
│                                                │
│  ┌──────────────────────────────────────┐    │
│  │  CDN Edge Locations (Global)         │    │
│  │  - Cached static assets              │    │
│  │  - SSL/TLS encryption                │    │
│  │  - DDoS protection                   │    │
│  └──────────────────────────────────────┘    │
└────────────────────────────────────────────────┘
                 │
                 │ User requests
                 │
┌────────────────▼───────────────────────────────┐
│              End Users                         │
│  - Web browsers                                │
│  - Mobile browsers                             │
│  - Any device with internet                    │
└────────────────────────────────────────────────┘
```

## Performance Optimization

```
Frontend Optimizations:
├── Code Splitting (React.lazy)
├── Image Optimization (Firebase CDN)
├── Lazy Loading Components
├── Memoization (useMemo, useCallback)
└── Efficient Re-renders

Backend Optimizations:
├── Composite Indexes (Firestore)
├── Query Optimization
├── Caching Strategy
├── CDN for Static Assets
└── Connection Pooling
```

## Monitoring & Analytics

```
┌─────────────────────────────────────────┐
│         Firebase Console                │
│                                         │
│  ├─ Authentication Stats               │
│  ├─ Firestore Usage                    │
│  ├─ Storage Usage                      │
│  ├─ Hosting Traffic                    │
│  └─ Error Logs                         │
└─────────────────────────────────────────┘
```

---

This architecture provides:
- **Scalability**: Firebase auto-scales
- **Security**: Multi-layer protection
- **Performance**: CDN + optimized queries
- **Reliability**: 99.95% uptime SLA
- **Maintainability**: Clean separation of concerns
