import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SelectTheaterAndMovieBar from "../components/showTheaterAndMovie";
import MovieBox from "../components/movieBox";
import { Buffer } from "buffer";
import ShowTime from "../components/showTime";

function MovieReservation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { movie = null, cinema = null } = location.state || {};
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);

  useEffect(() => {
    console.log("movie", movie, "cinema", cinema, "showTimes", showTimes);
    setShowTimes([]);
    if (movie?.id && !cinema?.id) {
      fetchCinemasForMovie(movie.id);
    } else if (cinema?.id && !movie?.id) {
      fetchMoviesForCinema(cinema.id);
    } else if (movie?.id && cinema?.id) {
      fetchShowTimes(movie.id, cinema.id);
    }
  }, [movie, cinema]);

  const fetchCinemasForMovie = async (movieId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/movie/${movieId}/cinemas`
      );
      const data = await response.json();
      // setCinemas(data);
      console.log(data);
      data.forEach((cinema) =>
        fetchShowTimes(movieId, cinema.CinemaLocationCode)
      );
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    }
  };

  const fetchMoviesForCinema = async (cinemaId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/cinema/${cinemaId}/movies`
      );
      const data = await response.json();
      console.log(data);

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const formattedMovies = data
        .map((movie) => {
          const releaseDate = new Date(movie.ReleaseDate);
          releaseDate.setHours(0, 0, 0, 0);

          return {
            id: movie.MovieID,
            poster: `data:image/jpeg;base64,${Buffer.from(movie.Image).toString(
              "base64"
            )}`,
            title: movie.Title,
            genre: movie.Genre,
            rating: movie.Rating.toString(),
            duration: `${movie.Duration} นาที`,
            releaseDate: releaseDate.toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            rawReleaseDate: releaseDate,
            description: movie.Description,
          };
        })
        .filter((movie) => movie.rawReleaseDate <= currentDate);

      setMovies(formattedMovies);
      console.log(formattedMovies);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลภาพยนตร์:", error);
    }
  };

  const fetchShowTimes = async (movieId, cinemaId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/movie/${movieId}/cinema/${cinemaId}`
      );
      const data = await response.json();
      console.log(data);
      setShowTimes((prevShowTimes) => [...prevShowTimes, ...data]);
      console.log("showtimeData", showTimes);
    } catch (error) {
      console.error("Error fetching show times:", error);
    }
  };

  const handleDetails = () => {
    navigate(`/movie-details/${movie.title}`, { state: { movie } });
  };

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      <Navbar />
      <SelectTheaterAndMovieBar />
      <div className="w-[60%] mx-auto">
        {cinema && !movie?.id && (
          <div className="text-white mt-8">
            <h2 className="text-2xl font-bold mb-4">
              โรงภาพยนตร์: {cinema.name}
            </h2>
            {movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {movies.map((movieItem) => (
                  <MovieBox
                    key={movieItem.id}
                    movie={movieItem}
                    cinema={cinema}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xl text-yellow-500">
                ไม่พบภาพยนตร์ในโรงภาพยนตร์นี้
              </p>
            )}
          </div>
        )}

        {movie.id && (
          <div className="flex items-center p-8 max-h-[40vh] my-20">
            <img
              src={movie.poster}
              alt={movie.title}
              className="movie-poster w-50 h-[50vh] rounded-xl"
            />
            <div className="movie-info text-white ml-8">
              <p className="release-date text-yellow-500 mb-2">
                {movie.releaseDate}
              </p>
              <h1 className="movie-title text-4xl font-bold mb-2">
                {movie.title}
              </h1>
              <p className="movie-description text-lg mb-4">
                {movie.description}
              </p>
              <div className="flex items-center mb-4">
                <span className="rating bg-gray-800 text-yellow-500 px-2 py-1 rounded mr-2">
                  Rating: {movie.rating}
                </span>
                <span className="duration text-gray-400">{movie.duration}</span>
              </div>
              <button
                onClick={handleDetails}
                className="w-[15%] p-2 mt-5 bg-red-500 text-white rounded-full hover:bg-red-700"
              >
                รายละเอียด
              </button>
              {cinema && (
                <p className="selected-cinema tex t-lg mt-3">
                  โรงภาพยนตร์ที่เลือก: {cinema.name}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-[70%] flex flex-col mx-auto">
        {(movie.id || (movie.id && cinema.id)) && (
          <ShowTime movie={movie} cinema={cinema} showTimes={showTimes} />
        )}
      </div>
    </div>
  );
}

export default MovieReservation;
