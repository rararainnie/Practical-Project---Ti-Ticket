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

    const renderShowTimes = () => {
        // แสดงรอบฉายตามข้อมูลที่ได้รับ
        return showTimes.map((showTime, index) => (
            <div key={index} className="show-time-item text-white mb-4">
                <h3 className="text-xl font-bold">{showTime.CinemaLocationName}</h3>
                <p>{showTime.CinemaLocationAddress}</p>
                <p>โรงที่: {showTime.CinemaNo}</p>
                <p>เวลาฉาย: {new Date(showTime.ShowDateTime).toLocaleString()}</p>
            </div>
        ));
    };

    return (
        <div className="bg-black min-h-screen">
            <Navbar />
            <SelectTheaterAndMovieBar />
            <div className="movie-details flex items-center p-8">
                {movie && (
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
                        </div>
                    </>
                )}
            </div>
            <div className="show-times p-8">
                <h2 className="text-2xl font-bold text-white mb-4">รอบฉาย</h2>
                {renderShowTimes()}
            </div>
        </div>
    )
}

export default MovieReservation;
