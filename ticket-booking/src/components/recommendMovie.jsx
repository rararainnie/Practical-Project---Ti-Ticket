import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

function RecommendMovie() {
  const [MoviesData, setMovies] = useState([]);
  useEffect(() => {
    // ดึงข้อมูลจาก backend
    fetch("http://localhost:3001/movies")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // แปลงข้อมูลที่ได้รับให้เป็นรูปแบบที่ต้องการ
        const formattedMovies = data.map((movie) => ({
          id: movie.MovieId,
          poster: `data:image/jpeg;base64,${Buffer.from(movie.Image).toString(
            "base64"
          )}`, // แปลง Buffer เป็น Base64
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

  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const movie = MoviesData[currentPosterIndex];
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const handleNext = useCallback(() => {
    setCurrentPosterIndex((prevIndex) => (prevIndex + 1) % MoviesData.length);
    resetInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MoviesData.length]);

  const handlePrevious = useCallback(() => {
    setCurrentPosterIndex(
      (prevIndex) => (prevIndex - 1 + MoviesData.length) % MoviesData.length
    );
    resetInterval();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MoviesData.length]);

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const handleBooking = () => {
    navigate(`/movie-details/${movie.title}`, { state: { movie } });
  };

  useEffect(() => {
    resetInterval();

    return () => {
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MoviesData.length]);

  if (!movie) {
    return <div>Loading...</div>; // แสดง loading หรือข้อความอื่น ๆ ขณะรอข้อมูล
  }

  return (
    <div className="flex justify-center items-center mt-3 relative">
      <div className="w-full max-w-[60%] h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={movie.poster}
          alt="Movie Poster"
          className="absolute w-[83%] h-[100%] object-contain transition-opacity duration-500 ease-in-out"
        />
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="absolute left-40 w-[5%] h-[100%] bg-black bg-opacity-10 hover:bg-gray-200 hover:bg-opacity-30 text-white text-2xl text-opacity-70 hover:text-opacity-100"
        >
          &lt; {/* or any icon */}
        </button>
        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-40 w-[5%] h-[100%] bg-black bg-opacity-10 hover:bg-gray-200 hover:bg-opacity-20 text-white text-2xl text-opacity-70 hover:text-opacity-100"
        >
          &gt; {/* or any icon */}
        </button>

        {/* Detail Poster */}
        <div className="w-[50%] absolute flex flex-col text-white p-4 bg-black bg-opacity-50 rounded-md bottom-0">
          <h1 className="font-bold text-xl mb-2">{movie.title}</h1>
          <h2 className="font-semibold text-sm mb-5">
            หมวดหมู่: {movie.genre} | เรทผู้ชม: {movie.rating} |{" "}
            {movie.duration} | วันที่เข้าฉาย: {movie.releaseDate}
          </h2>
          <button
            className="bg-blue-400 w-40 h-12 font-semibold rounded-sm hover:bg-blue-900 text-sm"
            onClick={handleBooking}
          >
            จองตั๋วภาพยนตร์
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendMovie;
