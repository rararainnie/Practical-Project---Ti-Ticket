import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function MovieBox({ movie, cinema }) {
  const navigate = useNavigate();

  const handleBoxClick = () => {
    navigate(`/movie-reservation/${movie.title}`, { state: { movie, cinema } });
  };
  return (
    <div
      className="mt-3 ml-2 p-2 bg-zinc-900 rounded-3xl max-w-lg cursor-pointer"
      onClick={handleBoxClick}
    >
      <div className="flex flex-col text-center items-center">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-[400px] rounded-3xl object-cover"
        />

        <div className="ml-3 flex flex-col mt-3">
          <div>
            <h2 className="text-lg font-extrabold text-white">{movie.title}</h2>
            <p className="text-sm text-yellow-500 mt-3">
              <strong>Date:</strong> {movie.releaseDate}
            </p>
            <p className="text-sm text-yellow-500  mt-1">
              <strong>Time:</strong> {movie.duration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

MovieBox.propTypes = {
  movie: PropTypes.object.isRequired,
  cinema: PropTypes.object.isRequired,
};

export default MovieBox;
