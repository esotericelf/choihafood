# ChoiHa Food — Tuck Shop Menu Manager

A single-page React app for managing and publishing daily tuck shop menus, built with Vite, Tailwind CSS, and Firebase.

## Tech Stack

- **Frontend:** Vite + React + Tailwind CSS + Lucide React
- **Drag & Drop:** `@hello-pangea/dnd`
- **Backend:** Firebase (Firestore + Auth)
- **Deploy:** Netlify

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env.local` and fill in your Firebase project credentials:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAIL=admin@tuckshop.com
```

### 3. Firebase Setup

In the [Firebase Console](https://console.firebase.google.com/):

1. **Create a project** (or use an existing one)
2. **Enable Authentication** → Sign-in method → Email/Password
3. **Create admin user:** Authentication → Users → Add user
   - Email: `admin@tuckshop.com` (or your `VITE_ADMIN_EMAIL` value)
   - Password: your chosen master password
4. **Create Firestore database** (production or test mode)
5. **Add Firestore security rules** (example below)
6. **Create a Web App** and copy config values into `.env.local`

#### Suggested Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /item_pool/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /daily_menus/{menuId} {
      allow read: if resource.data.published == true || request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Firestore Indexes

The archive query requires a composite index on `daily_menus`:
- `id` (Ascending)
- `id` (Descending) — range query with `orderBy`

Firebase will prompt you with a link to create this index on first use.

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Add environment variables from `.env.local` in Netlify site settings
4. Build command: `npm run build`, Publish directory: `dist`

## Features

- **Public View** — Shows today's published menu with date
- **Admin Login** — Master password only (hidden admin email)
- **Item Pool** — Add and manage reusable menu items
- **Menu Builder** — Drag items from pool to today's menu
- **Publish** — Save and publish the daily menu to Firestore
- **Date Archive** — Browse past menus by year/month
