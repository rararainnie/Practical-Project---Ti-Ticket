import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import SelectTheaterAndMovieBar from "../components/showTheaterAndMovie";

function MovieReservation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { movie, cinema } = location.state || {};
    const [cinemas, setCinemas] = useState([]);
    const [movies, setMovies] = useState([]);
    const [showTimes, setShowTimes] = useState([]);

    useEffect(() => {
        if (movie?.id && cinema?.id === undefined) {
            console.log(1)
            fetchCinemasForMovie(movie.id);
        } else if (cinema?.id && movie?.id === undefined) {
            console.log(2)
            fetchMoviesForCinema(cinema.id);
        } else if (movie?.id && cinema?.id) {
            console.log(3)
            fetchShowTimes(movie.id, cinema.id);
        }
    }, [movie, cinema]);

    const fetchCinemasForMovie = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:3001/movie/${movieId}/cinemas`);
            const data = await response.json();
            setCinemas(data);
            console.log(data)
            data.forEach(cinema => fetchShowTimes(movieId, cinema.CinemaLocationCode));
        } catch (error) {
            console.error('Error fetching cinemas:', error);
        }
    };

    const fetchMoviesForCinema = async (cinemaId) => {
        try {
            const response = await fetch(`http://localhost:3001/cinema/${cinemaId}/movies`);
            const data = await response.json();
            setMovies(data);
            console.log(data)
            data.forEach(movie => fetchShowTimes(movie.MovieID, cinemaId));
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    const fetchShowTimes = async (movieId, cinemaId) => {
        try {
            const response = await fetch(`http://localhost:3001/movie/${movieId}/cinema/${cinemaId}`);
            const data = await response.json();
            console.log(data)
            setShowTimes(prevShowTimes => [...prevShowTimes, ...data]);
        } catch (error) {
            console.error('Error fetching show times:', error);
        }
    };

  const handleDetails = () => {
    navigate(`/movie-details/${movie.title}`, { state: { movie } });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const generateDays = () => {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const today = new Date();
      const upcomingDays = Array.from({ length: 32 }).map((_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        return {
          day: dayNames[date.getDay()],
          date: date.getDate(),
          month: monthNames[date.getMonth()],
        };
      });

      setDays(upcomingDays);
    };

    generateDays();
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < days.length - 2) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <SelectTheaterAndMovieBar />
      <div className="w-[60%] mx-auto">
        <div className="flex items-center p-8 max-h-[40vh] my-20">
          {movie != null && (
            <>
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
                  <span className="duration text-gray-400">
                    {movie.duration}
                  </span>
                </div>
                <button
                  onClick={handleDetails}
                  className="w-[15%] p-2 mt-5 bg-red-500 text-white rounded-full hover:bg-red-700"
                >
                  รายละเอียด
                </button>
                {cinema && (
                  <p className="selected-cinema text-lg mt-3">
                    โรงภาพยนตร์ที่เลือก: {cinema.name}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center justify-between w-full">
          <div className="flex border rounded-md p-2 bg-white w-full">
            <h1 className="flex-1 text-center">เลือกรอบภาพยนตร์</h1>
            <h1 className="flex-1 text-center">เลือกที่นั่ง</h1>
            <h1 className="flex-1 text-center">ซื้อตั๋ว</h1>
          </div>

          <div className="flex w-full gap-x-12 mt-5">
            <button
              className="flex flex-col items-center justify-center rounded-md bg-red-500 text-white font-bold"
              style={{ width: "70px", height: "70px" }}
            >
              <span className="text-[10px] font-semibold">
                {days[0]?.month}
              </span>
              <span className="text-sm font-bold">{days[0]?.day}</span>
              <span className="text-lg font-bold">{days[0]?.date}</span>
            </button>

            {/* Scrollable Subsequent Days */}
            <div className="flex justify-between w-[90%]">
              {/* Arrow to Previous Days */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="text-white hover:bg-gray-200 hover:bg-opacity-20 text-xl p-3 rounded-md"
              >
                &lt;
              </button>

              {days
                .slice(currentIndex + 1, currentIndex + 10)
                .map((day, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center justify-center rounded-md bg-gray-800 text-yellow-500 hover:bg-gray-500"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <span className="text-[10px] font-semibold">
                      {day.month}
                    </span>
                    <span className="text-sm font-bold">{day.day}</span>
                    <span className="text-lg font-bold">{day.date}</span>
                  </button>
                ))}

              {/* Arrow to Next Days */}
              <button
                onClick={handleNext}
                disabled={currentIndex >= days.length - 10}
                className="text-white hover:bg-gray-200 hover:bg-opacity-20 text-xl p-3 rounded-md"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieReservation;
