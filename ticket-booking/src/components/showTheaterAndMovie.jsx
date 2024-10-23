import { useState, useEffect } from "react";
import { Buffer } from 'buffer';

function ShowTheaterAndMovie() {
  const [moviesData, setMoviesData] = useState([]);
  const [cinemaLocations, setCinemaLocations] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState([]);
  const [showMovieModal, setShowMovieModal] = useState(false); // For controlling Movie Modal visibility
  const [showCinemaModal, setShowCinemaModal] = useState(false); // For controlling Cinema Modal visibility

  // Fetch Movies
  useEffect(() => {
    fetch('http://localhost:3001/movies')
      .then(response => response.json())
      .then(data => {
        const formattedMovies = data.map(movie => ({
          id: movie.MovieId,
          poster: `data:image/jpeg;base64,${Buffer.from(movie.Image).toString('base64')}`,
          title: movie.Title,
          genre: movie.Genre,
          rating: movie.Rating.toString(),
          duration: `${movie.Duration} นาที`,
          releaseDate: new Date(movie.ReleaseDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
          description: movie.Description,
        }));
        setMoviesData(formattedMovies);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  // Fetch Cinema Locations
  useEffect(() => {
    fetch('http://localhost:3001/cinemalocation')
      .then(response => response.json())
      .then(data => {
        const formattedCinemaLocations = data.map(location => ({
          id: location.CinemaLocationCode,
          name: location.Name,
          zone: location.Zone_ZoneID,
        }));
        setCinemaLocations(formattedCinemaLocations);
      })
      .catch(error => {
        console.error('Error fetching cinema locations:', error);
      });
  }, []);

  // Fetch Zones
  useEffect(() => {
    fetch('http://localhost:3001/zone')
      .then(response => response.json())
      .then(data => {
        const formattedZones = data.map(zone => ({
          id: zone.ZoneID,
          name: zone.Name,
        }));
        setZones(formattedZones);
      })
      .catch(error => {
        console.error('Error fetching zones:', error);
      });
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setShowMovieModal(false);
  };

  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema);
    setShowCinemaModal(false);
  };

  const handleSubmit = () => {
    if (!selectedCinema && !selectedMovie) {
      alert('Please select both Cinema and Movie');
    } else if (!selectedCinema) {
      alert(`Please select a Cinema.\nSelected Movie: ${selectedMovie.title}`);
    } else if (!selectedMovie) {
      alert(`Please select a Movie.\nSelected Cinema: ${selectedCinema.name}`);
    } else {
      alert(`Selected Movie: ${selectedMovie.title}\nSelected Cinema: ${selectedCinema.name}`);
    }
  };

  return (
    <div className="flex justify-center mt-8 relative mb-5">
      <div className="w-[50%] bg-gray-500 bg-opacity-30 rounded-md p-4">
        <div className="flex space-x-4">
          {/* Column: Select Cinema */}
          <div className="flex-1 relative">
            <div
              onClick={() => setShowCinemaModal(!showCinemaModal) || setShowMovieModal(false)} // Open cinema modal
              className="w-full p-2 rounded-md bg-white cursor-pointer flex justify-between items-center"
            >
              <span>{selectedCinema.name || '-- กรุณาเลือกโรงภาพยนตร์ --'}</span>
            </div>
          </div>

          {/* Column: Select Movie */}
          <div className="flex-1 relative">
            <div
              onClick={() => setShowMovieModal(!showMovieModal) || setShowCinemaModal(false)} // Open movie modal
              className="w-full p-2 rounded-md bg-white cursor-pointer flex justify-between items-center"
            >
              <span>{selectedMovie.title || '-- กรุณาเลือกภาพยนตร์ --'}</span>
            </div>
          </div>

          {/* Column: Search Button */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!selectedMovie || !selectedCinema} // Disable if no movie or cinema is selected
            >
              รอบฉาย
            </button>
          </div>
        </div>
      </div>

      {/* Movie Selection Pop-Up */}
      {showMovieModal && (
        <div className="absolute z-10 bg-white rounded-md shadow-lg w-[50%] mt-20">
          <h2 className="text-lg font-bold p-2">เลือกภาพยนตร์</h2>
          <div className="flex flex-wrap justify-between max-h-60 overflow-y-auto">
            {moviesData.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSelectMovie(movie)} // Select movie
                className="flex flex-col items-center text-center p-2 hover:bg-gray-200 cursor-pointer"
              >
                <img src={movie.poster} alt={movie.title} className="w-40" />
                <span>{movie.releaseDate}</span> 
                <span>{movie.title}</span> 
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cinema Selection Pop-Up */}
      {showCinemaModal && (
        <div className="absolute z-10 bg-white rounded-md shadow-lg w-[50%] mt-20">
          <h2 className="text-lg font-bold p-2">เลือกโรงภาพยนตร์</h2>
          <div className="flex flex-wrap justify-between max-h-48 overflow-y-auto">
            {zones.map((zone) => (
              <div key={zone.id} className="w-[48%] p-2">
                <h3 className="font-semibold">{zone.name}</h3>
                {cinemaLocations.filter(cinema => cinema.zone === zone.id).map(cinema => (
                  <div
                    key={cinema.id}
                    onClick={() => handleSelectCinema(cinema)}
                    className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    <span>{cinema.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowTheaterAndMovie;
