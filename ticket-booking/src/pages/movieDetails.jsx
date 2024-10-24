import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

function MovieDetails() {
  const location = useLocation();
  const { movie } = location.state || {}; // Retrieve the movie from the state
  const navigate = useNavigate();

  if (!movie) return <p className="text-black">Movie not found</p>;

  const handleBooking = () => {
    navigate(`/movie-details/${movie.title}`, { state: { movie } });
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center mt-3 relative">
        <div className="w-full max-w-[60%] h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            src={movie.poster}
            alt="Movie Poster"
            className="absolute w-[83%] h-[100%] object-contain transition-opacity duration-500 ease-in-out"
          />
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

      <div className="bg-black min-h-screen flex items-center justify-center">
        {/* Gray background box */}
        <div className="bg-zinc-800 p-5 rounded-2xl w-[50%] h-70 flex justify-center items-center relative">
          {/* Left section - Movie poster */}
          <div className="w-1/3 flex justify-start mr-10 relative" style={{ left: '-90px' }}>
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-[100%] h-auto"
            />
          </div>

          {/* Right section - Movie details */}
          <div className="w-2/3 ml-10 text-white relative" style={{ left: '-80px' }}>
            {/* Movie Title */}
            <h1 className="text-4xl font-bold mb-3">{movie.title}</h1>
            {/* Release Date, Genre, Rating, and Duration */}
            <div className="text-white mb-10">
              <p>
                <strong>วันที่เข้าฉาย:</strong> {movie.releaseDate}
              </p>
              <p>
                <strong>หมวดหมู่:</strong> {movie.genre}
              </p>
              <p>
                <strong>เรทผู้ชม:</strong> {movie.rating}
              </p>
              <p>
                <strong>ระยะเวลา:</strong> {movie.duration}
              </p>
              <p>
                <strong>รายละเอียด:</strong> {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MovieDetails.propTypes = {
  movie: PropTypes.object,
};

export default MovieDetails;
