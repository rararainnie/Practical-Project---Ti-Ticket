import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import SelectTheaterAndMovieBar from "../components/showTheaterAndMovie";

function MovieReservation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { movie, cinema } = location.state || {};

    const handleDetails = () => {
        navigate(`/movie-details/${movie.title}`, { state: { movie } });
    };

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <SelectTheaterAndMovieBar />
            <div className="movie-details flex items-center p-8">
                {movie != null && (
                    <>
                        <img src={movie.poster} alt={movie.title} className="movie-poster w-1/3 rounded-lg shadow-lg" />
                        <div className="movie-info text-white ml-8">
                            <p className="release-date text-yellow-500 mb-2">{movie.releaseDate}</p>
                            <h1 className="movie-title text-4xl font-bold mb-2">{movie.title}</h1>
                            <p className="movie-description text-lg mb-4">{movie.description}</p>
                            <div className="flex items-center mb-4">
                                <span className="rating bg-gray-800 text-yellow-500 px-2 py-1 rounded mr-2">{movie.rating}</span>
                                <span className="duration text-gray-400">{movie.duration}</span>
                            </div>
                            <button
                                onClick={handleDetails}
                                className="w-[20%] p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                            >
                                รายละเอียด
                            </button>
                            {cinema && (
                                <p className="selected-cinema text-lg">โรงภาพยนตร์ที่เลือก: {cinema.name}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MovieReservation;
