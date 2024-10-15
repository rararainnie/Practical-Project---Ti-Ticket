import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import MovieBox from "../components/MovieBox";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";
import moviesDetail from "../components/moviesData";

function Home() {
  const handleBuyTickets = () => {
    alert("Tickets purchase functionality is not implemented yet.");
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />

      <div className="pt-1 w-[60%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {moviesDetail.map(movie=>(
            <MovieBox
            key={movie.id}
            image={movie.poster}
            name={movie.title}
            date={movie.releaseDate}
            time={movie.duration}
            location="Concert Hall, City Center"
            onBuyTickets={handleBuyTickets}
          />
          ))}
          
        </div>
      </div>
    </div>
  );  
};

export default Home;
