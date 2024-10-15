import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";
import MoviesData from "../components/moviesData";
import MovieBox from "../components/movieBox";

function Home() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />

      <div className="pt-1 w-[60%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MoviesData.map((movie) => (
            <MovieBox
              key={movie.id}
              id={movie.id}
              image={movie.poster}
              name={movie.title}
              date={movie.releaseDate}
              time={movie.duration}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
