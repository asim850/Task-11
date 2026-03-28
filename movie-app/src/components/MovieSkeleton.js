const MovieSkeleton = () => {
  return (
    <div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg h-[400px] w-full relative">
      <div className="absolute bottom-0 left-0 p-4 w-full space-y-2">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default MovieSkeleton;