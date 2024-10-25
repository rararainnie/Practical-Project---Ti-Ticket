import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";
import MovieBox from "../components/movieBox";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";

function Home() {
  const [movies, setMovies] = useState([]);
  const [underlined, setUnderlined] = useState(null);

  const handleClick = (index) => {
    setUnderlined(index);
  };

  useEffect(() => {
    // Fetch data from backend
    fetch("http://localhost:3001/movies")
      .then((response) => response.json())
      .then((data) => {
        // Format the data
        const formattedMovies = data.map((movie) => ({
          id: movie.MovieId,
          poster: `data:image/jpeg;base64,${Buffer.from(movie.Image).toString(
            "base64"
          )}`,
          title: movie.Title,
          genre: movie.Genre,
          rating: movie.Rating.toString(),
          duration: `${movie.Duration} นาที`,
          releaseDate: new Date(movie.ReleaseDate).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          description: movie.Description,
        }));

        setMovies(formattedMovies);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />
      <div className="pt-1 w-[60%] mx-auto">
        <h1 className="text-red-500 text-3xl text-center">ภาพยนตร์</h1>
        <div className="text-white text-xl text-center space-x-10 mt-5 mb-5 ">
          <span
            className={`cursor-pointer ${underlined === 0 ? "underline" : ""}`}
            onClick={() => handleClick(0)}
          >
            กำลังฉาย
          </span>

          <span
            className={`cursor-pointer ${underlined === 1 ? "underline" : ""}`}
            onClick={() => handleClick(1)}
          >
            โปรแกรมหน้า
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {movies.map((movie) => (
            <MovieBox key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
