import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import MoviesData from "../components/moviesData";

function MovieDetails() {
  const { movieName } = useParams(); // Retrieve the movieId from the URL
  const movie = MoviesData.find((movie) => movie.title === movieName); // Find the matching movie

  if (!movie) return <p className="text-black">Movie not found</p>; // Handle invalid movieId

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="bg-black min-h-screen text-white p-10">
        <h1 className="text-3xl font-bold mb-5">{movie.title}</h1>
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-96 h-auto rounded-3xl mb-5"
        />
        <p>
          <strong>Genre:</strong> {movie.genre}
        </p>
        <p>
          <strong>Rating:</strong> {movie.rating}
        </p>
        <p>
          <strong>Duration:</strong> {movie.duration}
        </p>
        <p>
          <strong>Release Date:</strong> {movie.releaseDate}
        </p>
      </div>
    </div>
  );
}

export default MovieDetails;
