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
                <p className="selected-cinema text-lg mt-3">
                  โรงภาพยนตร์ที่เลือก: {cinema.name}
                </p>
              )}
            </div>
          </div>
        )}
        {(movie.id || (movie.id && cinema.id)) && (
          <ShowTime movie={movie} cinema={cinema} showTimes={showTimes} />
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
              <p className="selected-cinema text-lg mt-3">
                โรงภาพยนตร์ที่เลือก: {cinema.name}
              </p>
            )}
          </div>
        </div>
      )}
      {(movie.id || (movie.id && cinema.id)) && (
        <>
          <div className="flex flex-col items-center justify-between w-full">
            <div className="flex border rounded-md p-2 bg-white w-full">
              <h1 className="flex-1 text-center">เลือกรอบภาพยนตร์</h1>
              <h1 className="flex-1 text-center">เลือกที่นั่ง</h1>
              <h1 className="flex-1 text-center">ซื้อตั๋ว</h1>
            </div>

            <div className="flex w-full items-center justify-between mt-5">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="text-white hover:bg-gray-200 hover:bg-opacity-20 text-xl p-3 rounded-md"
              >
                &lt;
              </button>

              <div className="flex gap-x-2 overflow-x-auto">
                {days
                  .slice(currentIndex, currentIndex + 11)
                  .map((day, index) => {
                    const isToday =
                      day.fullDate === new Date().toISOString().split("T")[0];
                    return (
                      <button
                        key={index}
                        className={`flex flex-col items-center justify-center rounded-md ${
                          day.fullDate === selectedDate
                            ? "bg-red-500 text-white"
                            : "bg-gray-800 text-yellow-500 hover:bg-gray-500"
                        }`}
                        style={{
                          width: "70px",
                          height: "70px",
                          flex: "0 0 auto",
                        }}
                        onClick={() => handleDateClick(day.fullDate)}
                      >
                        {isToday ? (
                          <>
                            <span className="text-sm font-bold">Today</span>
                            <span className="text-lg font-bold">
                              {day.date}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[10px] font-semibold">
                              {day.month}
                            </span>
                            <span className="text-sm font-bold">{day.day}</span>
                            <span className="text-lg font-bold">
                              {day.date}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex >= days.length - 11}
                className="text-white hover:bg-gray-200 hover:bg-opacity-20 text-xl p-3 rounded-md"
              >
                &gt;
              </button>
            </div>
          </div>

          <div className="mt-8">
            {showTimes.length > 0 ? (
              (() => {
                const filteredShowTimes = filterShowTimesByDate(
                  showTimes,
                  selectedDate
                );
                if (filteredShowTimes.length === 0) {
                  return (
                    <p className="text-xl text-yellow-500">
                      ไม่พบรอบฉายสำหรับภาพยนตร์นี้ในวันที่เลือก
                    </p>
                  );
                }
                return Object.values(
                  filteredShowTimes.reduce((acc, showTime) => {
                    if (!acc[showTime.CinemaLocationName]) {
                      acc[showTime.CinemaLocationName] = {
                        CinemaLocationId: showTime.CinemaLocationId,
                        CinemaLocationName: showTime.CinemaLocationName,
                        Cinemas: {},
                      };
                    }
                    if (
                      !acc[showTime.CinemaLocationName].Cinemas[
                        showTime.CinemaNoName
                      ]
                    ) {
                      acc[showTime.CinemaLocationName].Cinemas[
                        showTime.CinemaNoName
                      ] = {
                        CinemaNo: showTime.CinemaNo,
                        CinemaNoName: showTime.CinemaNoName,
                        ShowTimes: new Set(),
                      };
                    }
                    acc[showTime.CinemaLocationName].Cinemas[
                      showTime.CinemaNoName
                    ].ShowTimes.add(
                      JSON.stringify({
                        TimeCode: showTime.TimeCode,
                        ShowDateTime: showTime.ShowDateTime,
                      })
                    );
                    return acc;
                  }, {})
                ).map((location, locationIndex) => (
                  <div
                    key={locationIndex}
                    className="bg-gray-800 rounded-lg p-4 mb-4"
                  >
                    <h3 className="text-yellow-500 text-xl mb-2">
                      {location.CinemaLocationName}
                    </h3>
                    {Object.values(location.Cinemas).map(
                      (cinema, cinemaIndex) => (
                        <div key={cinemaIndex} className="mb-3">
                          <p className="text-white mb-2">
                            {cinema.CinemaNoName}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[...cinema.ShowTimes]
                              .map((timeStr) => JSON.parse(timeStr))
                              .sort(
                                (a, b) =>
                                  new Date(a.ShowDateTime) -
                                  new Date(b.ShowDateTime)
                              )
                              .map((time, timeIndex) => {
                                const showTime = new Date(time.ShowDateTime);
                                const currentTime = new Date();
                                const timeDifference =
                                  showTime.getTime() - currentTime.getTime();
                                const minutesDifference =
                                  timeDifference / (1000 * 60);
                                const isDisabled = minutesDifference <= 30;

                                return (
                                  <button
                                    key={timeIndex}
                                    className={`px-3 py-1 rounded ${
                                      isDisabled
                                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                        : selectedTimeCode === time.TimeCode
                                        ? "bg-blue-500 text-white"
                                        : "bg-red-500 text-white hover:bg-red-600"
                                    }`}
                                    onClick={() =>
                                      handleTimeClick(
                                        time.TimeCode,
                                        time.ShowDateTime
                                      )
                                    }
                                    disabled={isDisabled}
                                  >
                                    {showTime.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ));
              })()
            ) : (
              <p className="text-xl text-yellow-500">
                ไม่พบรอบฉายสำหรับภาพยนตร์นี้
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MovieReservation;
