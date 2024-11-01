import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import SelectTheaterAndMovieBar from "../components/showTheaterAndMovie";
import MovieBox from "../components/movieBox";
import { Buffer } from "buffer";
import ShowTime from "../components/showTime";

function MovieReservation() {
  // const navigate = useNavigate();
  const location = useLocation();
  const { movie = null, cinema = null } = location.state || {};
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);

  useEffect(() => {
    console.log("movie", movie, "cinema", cinema, "showTimes", showTimes);
    setShowTimes([]);
    setIsLoadingShowtimes(true);
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
      console.log("fetchCinemasForMovie", data);
      if (data.length > 0) {
        data.forEach((cinema) =>
          fetchShowTimes(movieId, cinema.CinemaLocationCode)
        );
      }
    } catch (error) {
      console.error("Error fetching cinemas:", error);
    } finally {
      setIsLoadingShowtimes(false);
    }
  };

  const fetchMoviesForCinema = async (cinemaId) => {
    setIsLoading(true);
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
      console.error("Error fetching movies:", error);
      setMovies([]);
    } finally {
      setIsLoading(false);
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
    } finally {
      setIsLoadingShowtimes(false);
    }
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
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-yellow-500 text-lg">
                    กำลังโหลดข้อมูลภาพยนตร์...
                  </p>
                </div>
              </div>
            ) : movies.length > 0 ? (
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
              <div className="flex items-center justify-center">
                <p className="text-yellow-500 text-xl">
                  ไม่พบภาพยนตร์ในโรงภาพยนตร์นี้
                </p>
              </div>
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

              <span className="flex items-center mb-4 space-x-2 text-gray-400">
                <p>{movie.genre}</p>
                <p>|</p>
                <p>Rating: {movie.rating}</p>
                <p>|</p>
                <p>{movie.duration}</p>
              </span>

              <p className="movie-description text-lg mb-4">
                {movie.description}
              </p>
              <div className="flex items-center mb-4">
                <span className="rating bg-gray-800 text-yellow-500 px-2 py-1 rounded mr-2">
                  Rating: {movie.rating}
                </span>
                <span className="duration text-gray-400">{movie.duration}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-[70%] flex flex-col mx-auto">
        {(movie.id || (movie.id && cinema.id)) && (
          <>
            {isLoadingShowtimes ? (
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-yellow-500 text-lg">
                    กำลังโหลดข้อมูลรอบฉาย...
                  </p>
                </div>
              </div>
            ) : (
              <ShowTime movie={movie} cinema={cinema} showTimes={showTimes} />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MovieReservation;
