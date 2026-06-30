# 彩霞美食 (ChoiHa Food) — Tuck Shop Menu Manager

A single-page React app for managing and publishing daily tuck shop menus, built with Vite, Tailwind CSS, and Firebase.

## Tech Stack

- **Frontend:** Vite + React + Tailwind CSS + Lucide React
- **Drag & Drop:** `@hello-pangea/dnd`
- **Backend:** Firebase (Firestore + Auth)
- **Deploy:** Netlify
- **Analytics:** Google Analytics (G-C5M1Q15TVB)
- **SEO:** robots.txt, sitemap.xml

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
- `id` (Descending)

Firebase will prompt you with a link to create this index on first use.

### 4. Configure Authorized Domains (Firebase Auth)

After deploying to Netlify, add your Netlify domain to Firebase:

- Firebase Console → Authentication → Settings → **Authorized domains**
- Add your Netlify URL (e.g., `choihafood.netlify.app`)

Without this, admin login will fail on the deployed site with an "auth/unauthorized-domain" error. `localhost` is pre-authorized for local dev.

### 5. Run locally

```bash
npm run dev
```

### 6. Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Add **all** `VITE_*` environment variables from `.env.local` in:
   - Netlify → Site configuration → Environment variables
4. Build command: `npm run build`, Publish directory: `dist`
5. After deployment, add your Netlify domain to Firebase authorized domains (see step 4)

---

## Deployment Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| **Blank page on deploy** | JavaScript error or missing redirect rule | Check `netlify.toml` has the `/* → /index.html` redirect (status 200, not 301). Check browser console for errors. |
| **Admin login fails on Netlify** | Firebase "auth/unauthorized-domain" error | Add your Netlify domain to Firebase Auth → Settings → Authorized domains. |
| **Login works but menus don't load** | Firestore rules too restrictive | Ensure `item_pool` has `allow read: if true`. |
| **Firebase "permission_denied"** | User not authenticated, or rules block the operation | Log into admin first. Check security rules match what's in this README. |
| **"Missing env vars" console warning** | Netlify env vars not set | Re-check that every `VITE_FIREBASE_*` + `VITE_ADMIN_EMAIL` variable exists in Netlify site settings. |
| **Archive query fails with index error** | No composite index on `daily_menus.id` | Click the link in the browser console error. Firestore auto-creates it. |
| **Build fails on Netlify** | Node version mismatch | Netlify defaults to Node 18+. Add a `.nvmrc` file with `18` if needed, or set `NODE_VERSION` in Netlify env. |
| **CORS errors in browser** | Firebase not initialized properly | Verify all Firebase config values are correct and non-empty. `localhost` works by default; custom domains need to be added to authorized domains. |
| **Images/favicon broken** | Missing static assets in `public/` | Ensure `public/` contains `favicon.svg`, `robots.txt`, and `sitemap.xml`. |

### Quick Deployment Check

```bash
# 1. Build locally to catch errors early
npm run build

# 2. Verify .env.local has no empty values
cat .env.local

# 3. Start preview server to test the built app
npm run preview
```

---

## Features

- **Public View** — Shows today's published menu with date
- **Admin Login** — Master password only (hidden admin email)
- **Mobile-First Admin Dashboard** — Tabbed layout (Manage Pool / Today's Menu / Archive)
- **Item Pool CRUD** — Add, edit (long-press + bottom sheet), delete from master pool with cascade to staged menu
- **Tap-to-Add / Tap-to-Remove** — No drag-and-drop required on mobile
- **Publish** — Save and publish the daily menu to Firestore
- **Date Archive** — Browse, load-to-workspace, and delete past menus
- **Toast Notifications** — Confirmation toasts for quick actions
- **Success Overlay** — Animated checkmark for publish/delete confirmations
- **Chinese UI (zh-CN)** — Branded as 彩霞美食
- **Google Analytics** — Page view tracking (G-7N54JBN6X9)
- **robots.txt + sitemap.xml** — SEO basics