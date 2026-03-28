import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // 1. Guard against empty or invalid IDs
      if (!id || id === "undefined" || id === ":id") {
        if (isMounted) setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 2. Fetch Core Movie Details (Required)
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        
        if (isMounted) {
          setMovie(res.data);
          
          // 3. Fetch Trailer (Optional - Fail Silently)
          try {
            const videoRes = await axios.get(
              `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
            );
            const officialTrailer = videoRes.data.results.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );
            setTrailer(officialTrailer ? officialTrailer.key : null);
          } catch (vErr) {
            console.warn("Trailer not available for this movie.");
          }

          // 4. Fetch Watchlist Status (Optional - Fail Silently)
          if (user?.uid) {
            try {
              const docRef = doc(db, "watchlists", user.uid, "movies", id.toString());
              const docSnap = await getDoc(docRef);
              setIsSaved(docSnap.exists());
            } catch (fsErr) {
              console.warn("Firebase watchlist status check failed.");
            }
          }
        }
      } catch (err) {
        console.error("Critical API Error:", err);
        // Only show error toast if the main movie data fails and it's not a simple 404
        if (isMounted && err.response?.status !== 404) {
          toast.error("Failed to load movie details", { id: 'fetch-error' });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, API_KEY, user?.uid]);

  const toggleWatchlist = async () => {
    if (!user) return toast.error("Please login to save movies");
    if (!movie) return;

    const movieRef = doc(db, "watchlists", user.uid, "movies", movie.id.toString());

    try {
      if (isSaved) {
        await deleteDoc(movieRef);
        setIsSaved(false);
        toast.success("Removed from Watchlist");
      } else {
        await setDoc(movieRef, {
          id: movie.id,
          title: movie.title,
          poster: movie.poster_path,
          rating: movie.vote_average,
          timestamp: new Date()
        });
        setIsSaved(true);
        toast.success("Added to Watchlist!");
      }
    } catch (error) {
      toast.error("Database error. Try again.");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  // If loading finished but no movie was found
  if (!movie) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 gap-4">
      <h2 className="text-2xl font-bold dark:text-white">Movie not found</h2>
      <button onClick={() => navigate('/')} className="text-red-600 font-bold hover:underline">
        Go Back Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 md:p-12 text-slate-900 dark:text-white transition-colors">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-red-600 font-bold hover:underline flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Poster Section */}
        <div className="w-full md:w-80 flex-shrink-0">
          <img 
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : 'https://via.placeholder.com/500x750?text=No+Poster+Available'} 
            className="rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full" 
            alt={movie.title} 
          />
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{movie.title}</h1>
          
          <div className="flex items-center flex-wrap gap-4 mb-6">
            <span className="text-red-600 font-bold text-xl flex items-center gap-1">
              ★ {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {movie.release_date ? movie.release_date.split('-')[0] : 'Upcoming'}
            </span>
            <span className="border border-slate-400 dark:border-slate-600 px-2 py-0.5 text-xs rounded uppercase text-slate-500">
              {movie.runtime ? `${movie.runtime} min` : 'HD'}
            </span>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 mb-8 max-w-3xl italic">
            {movie.tagline && `"${movie.tagline}"`}
          </p>

          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200 mb-8 max-w-3xl">
            {movie.overview || "No description available for this title."}
          </p>
          
          <div className="flex items-center gap-4">
            {trailer && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
              >
                ▶ Watch Trailer
              </button>
            )}

            <button 
              onClick={toggleWatchlist} 
              className="p-3.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-300 dark:border-slate-700 group"
              title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {isSaved ? (
                <AiFillHeart className="text-red-600 animate-pulse" size={24} />
              ) : (
                <AiOutlineHeart className="text-slate-500 dark:text-white group-hover:scale-110 transition-transform" size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && trailer && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video">
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute -top-12 right-0 text-white text-xl hover:text-red-600 transition-colors font-bold flex items-center gap-2"
            >
              ✕ Close Player
            </button>
            <iframe 
              className="w-full h-full rounded-xl shadow-2xl border border-white/10"
              src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube Video Player"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;