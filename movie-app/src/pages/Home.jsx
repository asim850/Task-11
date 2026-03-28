import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../features/movieSlice';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const observer = useRef();
  
  const { items, status, page, searchTerm } = useSelector((state) => state.movie);

  const lastMovieRef = useCallback(node => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !searchTerm) {
        dispatch(fetchMovies(page + 1));
      }
    });

    if (node) observer.current.observe(node);
  }, [status, page, searchTerm, dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies(1));
    }
  }, [status, dispatch]);

  return (
    <div className="p-6 bg-white dark:bg-slate-950 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white capitalize">
          {searchTerm ? `Results for: "${searchTerm}"` : "Popular on Movie-App"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((movie, index) => {
            if (items.length === index + 1) {
              return (
                <div ref={lastMovieRef} key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              );
            } else {
              return <MovieCard key={movie.id} movie={movie} />;
            }
          })}
        </div>

        {/* Loading Spinner at the bottom */}
        {status === 'loading' && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};
const MovieCard = ({ movie }) => (
  <Link to={`/movie/${movie.id}`} className="block group">
    <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg border border-slate-200 dark:border-slate-800">
      <img 
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'} 
        alt={movie.title}
        className="w-full h-[300px] md:h-[400px] object-cover"
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-4 transition-opacity">
        <p className="text-white font-bold">{movie.title}</p>
        <p className="text-red-500 text-sm">★ {movie.vote_average?.toFixed(1)}</p>
      </div>
    </div>
  </Link>
);

export default Home;