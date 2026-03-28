# 🎬 Movie App - MERN Stack (Firebase Edition)

A high-performance, responsive movie discovery platform built with **React**, **Redux Toolkit**, and **Tailwind CSS**, featuring real-time data from **TMDB API** and secure authentication via **Firebase**.

---

## 🚀 Features Implemented

* **Secure Authentication**: Google OAuth and Email/Password login integration using **Firebase Auth**.
* **Dynamic Search**: Real-time movie search functionality with instant UI updates.
* **Infinite Scroll**: Seamless browsing experience using the **Intersection Observer API** to load more movies as you scroll.
* **Personal Watchlist**: Users can save their favorite movies to a private watchlist synced with **Cloud Firestore**.
* **Movie Details & Trailers**: Dedicated details page for every movie featuring overviews, ratings, and embedded YouTube trailers.
* **Responsive Dark Mode**: Full support for Dark/Light modes with a custom theme engine and glassmorphism UI elements.
* **Smooth UX**: Includes a "Back to Top" floating button and loading skeletons for a premium feel.

---

## 🛠️ Technologies Used

* **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion (for animations).
* **State Management**: Redux Toolkit (Async Thunks).
* **Backend/Database**: Firebase (Authentication & Firestore).
* **API**: TMDB (The Movie Database) API.
* **Icons & Toasts**: React Icons, React Hot Toast.
* **Routing**: React Router DOM v6.

---

## 📦 Project Setup Steps

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

Install Dependences
npm install

VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id


npm run dev
