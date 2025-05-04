# 🔥 Fireplay

**Fireplay** is a blazing fast Progressive Web App (PWA) for discovering and exploring video games using the RAWG API. Built with Next.js 15, TailwindCSS, Firebase and fully installable on any device.

## 🚀 Features

* Game search with instant suggestions
* User authentication via Firebase
* Favorites and cart system
* Responsive UI with mobile dropdowns
* Fully installable PWA (Progressive Web App)
* Game details with screenshots and reviews

## 🧩 Technologies Used

* Next.js 15
* TailwindCSS
* RAWG API
* Firebase Auth
* next-pwa

## 📦 Installation Guide

1. Clone the repository

```bash
git clone https://github.com/your-username/fireplay.git
cd fireplay
```

2. Install dependencies

```bash
npm install
```

## 🔐 Environment Configuration

Create a `.env` file in the root of the project with the following variables:

```env
NEXT_PUBLIC_RAWG_API_KEY=your_rawg_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

⚠️ Make sure your Firebase project has **Email/Password authentication** enabled.

## 📲 Installable as a PWA

Fireplay can be installed as an app on your device:

1. Open the app at `http://localhost:3000/` in **Google Chrome**
2. Ensure you're in **production mode**

```bash
npm run build
npm run start
```

3. When prompted, click **"Install"**
4. Alternatively, click the **install icon** in the browser address bar (on Chrome)

## 🧪 Development

To run in development mode:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
/public             → Static files (manifest, icons)
/src/app            → Next.js 15 app directory
/src/components     → Reusable components (e.g. Header, Footer)
/src/lib            → Firebase config
.env                → Environment variables
next.config.js      → Next + PWA configuration
manifest.json       → Web App Manifest
```
