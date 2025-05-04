# Fireplay

**Fireplay** is a blazing fast Progressive Web App (PWA) for discovering and exploring video games using the RAWG API. Built with Next.js 15, TailwindCSS, Firebase and fully installable on any device.

## https://fireplay-one.vercel.app/

## Features

* Game search with instant suggestions
* User authentication via Firebase
* Favorites and cart system
* Game details with revies, requirements and others
* Responsive UI with mobile dropdowns
* Fully installable PWA (Progressive Web App)

## Technologies Used

* Next.js 15
* TailwindCSS
* RAWG API
* Firebase Auth
* next-pwa
* Firestore Database

## Installation Guide

1. Clone the repository

```bash
git clone https://github.com/your-username/fireplay.git](https://github.com/alexiaruegut/fireplay
cd fireplay
```

2. Install dependencies

```bash
npm install
npm install firebase
npm install framer-motion
npm install react-intersection-observer
npm isntall @headlessui/react
npm install lodash
npm install next-pwa
npm install --save-dev @types/next-pwa
```

## Environment Configuration

To run Fireplay properly, you need to configure Firebase and the RAWG API. Follow these steps:
1. Firebase Setup
* Go to Firebase Console and create a new project.

* Inside your project, click on "Add App" → select Web App → give it a name and register it.

* Go to Authentication → Sign-in Method → Enable "Email/Password".

* Go to Firestore Database → Create Database → Start in test mode (or production if needed).

* Copy your Firebase config values (apiKey, authDomain, etc.).

2. RAWG API Key
* Sign up at rawg.io

* Go to https://rawg.io/apidocs → generate your API key

```env
# RAWG API
NEXT_PUBLIC_RAWG_API_KEY=your_rawg_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

⚠️ Make sure your Firebase project has **Email/Password authentication** enabled.

## Installable as a PWA

Fireplay can be installed as an app on your device:

1. Open the app at `http://localhost:3000/` in **Google Chrome**
2. Ensure you're in **production mode**

```bash
npm run build
npm run start
```

3. When prompted, click **"Install"**
4. Alternatively, click the **install icon** in the browser address bar (on Chrome)

## Development

To run in development mode:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm run start
```

## Project Structure

```
/public             → Static files (manifest, icons)
/src/app            → Next.js 15 app directory
/src/components     → Reusable components (e.g. Header, Footer)
/src/lib            → Firebase config
.env                → Environment variables
next.config.js      → Next + PWA configuration
```
