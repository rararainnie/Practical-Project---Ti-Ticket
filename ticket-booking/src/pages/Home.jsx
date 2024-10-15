import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import MovieBox from "../components/MovieBox";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";
import moviesDetail from "../components/moviesDetail"; 

// import bp from "../assets/moviePoster/Avengers.jpeg";
// import rv from "../assets/moviePoster/in-side-out-2.jpeg";
// import tw from "../assets/moviePoster/The-last-of-us.jpg";
// import gf from "../assets/moviePoster/The-Garfield-Movie(2024).jpg";

function Home() {
  const handleBuyTickets = () => {
    alert("Tickets purchase functionality is not implemented yet.");
  };

  // const n1 ="Avengers"
  // const n2 ="In Side Out 2"
  // const n3 ="The Last of Us"
  // const n4 ="The Garfield Movie"

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />

      <div className="pt-1 w-[60%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {moviesDetail.map((movie, key)=>(
            <MovieBox
            key={key}
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
