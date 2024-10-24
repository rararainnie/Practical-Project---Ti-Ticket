import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import SelectTheaterAndMovieBar from "../components/showTheaterAndMovie";

function MovieReservation() {
    const location = useLocation();
    const { movie } = location.state || {}; // Retrieve the movie from the state
    const navigate = useNavigate();

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <SelectTheaterAndMovieBar />
            <div className="movie-details flex items-center p-8">
                {movie && (
                    <>
                        <img src={movie.poster} alt={movie.title} className="movie-poster w-1/3 rounded-lg shadow-lg" />
                        <div className="movie-info text-white ml-8">
                            <p className="release-date text-yellow-500 mb-2">10 October 2024</p>
                            <h1 className="movie-title text-4xl font-bold mb-2">{movie.title}</h1>
                            <p className="movie-description text-lg mb-4">{movie.description}</p>
                            <div className="flex items-center mb-4">
                                <span className="rating bg-gray-800 text-yellow-500 px-2 py-1 rounded mr-2">U 15+</span>
                                <span className="duration text-gray-400">{movie.duration}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MovieReservation;
