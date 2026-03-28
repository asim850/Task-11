import Watchlist from './pages/Watchlist';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { setUser } from './features/authSlice';

import Home from './pages/Home';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import Navbar from './components/Navbar';

function App() {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  
  const darkMode = useSelector((state) => state.theme?.darkMode ?? true);
  const user = useSelector((state) => state.auth?.user ?? null);

  useEffect(() => {
    const root = window.document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (darkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#020617'; // slate-950
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#020617');
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#ffffff';
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        }));
      } else {
        dispatch(setUser(null));
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Initializing App...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Navbar only shows if user is authenticated */}
        {user && <Navbar />}
        
        <main>
          <Routes>
            {/* Protected Routes */}
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/movie/:id" element={user ? <MovieDetails /> : <Navigate to="/login" replace />} />
            <Route path="/watchlist" element={user ? <Watchlist /> : <Navigate to="/login" replace />} />
            
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            
            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;