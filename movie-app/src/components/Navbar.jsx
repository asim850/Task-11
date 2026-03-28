import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../features/themeSlice';
import { logout } from '../features/authSlice';
import { searchMovies, fetchMovies } from '../features/movieSlice';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { IoSearch, IoHeartOutline, IoLogOutOutline, IoCloseOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [watchlistCount, setWatchlistCount] = useState(0);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { darkMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.uid) {
      setWatchlistCount(0);
      return;
    }

    const q = collection(db, "watchlists", user.uid, "movies");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWatchlistCount(snapshot.docs.length);
    }, (error) => {
      console.error("Watchlist count error:", error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(searchMovies(query)); // Triggers the TMDB Search API
      navigate('/'); // Ensure user is on the home page to see results
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    dispatch(fetchMovies()); // Reset to trending/popular
    navigate('/');
  };

  const handleLogoClick = () => {
    setQuery("");
    dispatch(fetchMovies());
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      toast.success("Signed out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 p-4 flex flex-wrap gap-4 justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      
      <div className="flex items-center gap-4 md:gap-8">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className="text-2xl font-bold text-red-600 tracking-tighter hover:scale-105 transition-transform"
        >
          MOVIE APP
        </Link>

        {/* Dynamic Search Bar */}
        {user && (
          <form onSubmit={handleSearch} className="relative flex items-center group">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-slate-200 dark:bg-slate-800 text-sm px-4 py-2 pl-10 pr-10 rounded-full w-40 md:w-64 outline-none focus:ring-2 focus:ring-red-600 transition-all text-slate-900 dark:text-white"
            />
            {/* Search Icon (Now a functional button) */}
            <button 
              type="submit" 
              className="absolute left-3 text-slate-500 hover:text-red-600 transition-colors"
            >
              <IoSearch size={18} />
            </button>

            {/* Clear Button (Visible only when typing) */}
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 text-slate-500 hover:text-red-600 transition-colors"
              >
                <IoCloseOutline size={20} />
              </button>
            )}
          </form>
        )}
      </div>
      
      <div className="flex gap-4 md:gap-6 items-center">
        {/* Watchlist Link */}
        {user && (
          <Link 
            to="/watchlist" 
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors"
            title="My Watchlist"
          >
            <IoHeartOutline size={26} />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg border-2 border-white dark:border-slate-900 animate-in fade-in zoom-in">
                {watchlistCount}
              </span>
            )}
          </Link>
        )}

        {/* Theme Toggle */}
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xl"
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* User Profile & Logout */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-300 dark:border-slate-700 pl-4 md:pl-6">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold dark:text-white leading-tight truncate max-w-[100px]">
                {user.displayName || user.email.split('@')[0]}
              </p>
              <button 
                onClick={handleLogout}
                className="text-[10px] uppercase font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 ml-auto"
              >
                Logout <IoLogOutOutline size={12} />
              </button>
            </div>
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`} 
              alt="Profile" 
              className="w-9 h-9 rounded-full border-2 border-red-600 object-cover shadow-md"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;