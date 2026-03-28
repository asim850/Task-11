import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const q = collection(db, "watchlists", user.uid, "movies");
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMovies(snapshot.docs.map(doc => doc.data()));
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="p-8 min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      {movies.length === 0 ? (
        <p className="text-slate-500">Your watchlist is empty. Go heart some movies!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <div className="rounded-lg overflow-hidden border border-slate-800">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster}`} alt="" />
                <p className="p-2 text-sm font-bold truncate">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;