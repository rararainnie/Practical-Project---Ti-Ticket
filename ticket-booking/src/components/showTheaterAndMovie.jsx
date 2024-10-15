import { useState } from "react";
import moviesData from "../components/moviesData";

function ShowTheaterAndMovie() {
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [showMovieModal, setShowMovieModal] = useState(false); // For controlling Modal visibility

  const handleSelectMovie = (moviesData) => {
    setSelectedMovie(moviesData.title);
    setShowMovieModal(false);
  };

  const handleSelectCinema = (event) => {
    setSelectedCinema(event.target.value);
    setSelectedMovie('');
    setShowMovieModal(false);
  };

  const handleSubmit = () => {
    alert(`Selected Movie: ${selectedMovie}\nSelected Cinema: ${selectedCinema}`);
  };

  return (
    <div className="flex justify-center mt-8 relative mb-5">
      {/* Outer Box for the entire selection */}
      <div className="w-[50%] bg-gray-500 bg-opacity-30 rounded-3xl p-4">
        <div className="flex space-x-4">
          {/* Column 1: Select Cinema */}
          <div className="flex-1">
            <select
              value={selectedCinema}
              onChange={handleSelectCinema}
              className="w-full p-2 rounded-md"
            >
              <option value="">-- กรุณาเลือกโรงหนัง --</option>
              <option value="cinema1">โรงหนังที่ 1</option>
              <option value="cinema2">โรงหนังที่ 2</option>
              <option value="cinema3">โรงหนังที่ 3</option>
            </select>
          </div>

          {/* Column 2: Select Movie */}
          <div className="flex-1 relative">
            <div
              onClick={() => setShowMovieModal(!showMovieModal)} // Open modal
              className="w-full p-2 rounded-md bg-white cursor-pointer flex justify-between items-center"
            >
              <span>{selectedMovie || '-- กรุณาเลือกหนัง --'}</span> {/* Show selected movie or placeholder */}
            </div>
            
          </div>

          {/* Column 3: Search Button */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!selectedMovie} // Disable if no movie is selected
            >
              รอบฉาย
            </button>
          </div>
        </div>
      </div>
      {/* Movie Selection Pop-Up */}
      {showMovieModal && (
        <div className="absolute z-10 bg-white rounded-md shadow-lg w-[50%] mt-20">
          <h2 className="text-lg font-bold p-2">เลือกหนัง</h2>
          <div className="max-h-60 overflow-y-auto">
            {moviesData.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleSelectMovie(movie)} // Select movie
                className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
              >
                <img src={movie.poster} alt={movie.title} className="w-10 h-10 mr-2" />
                <span>{movie.title}</span> 
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowTheaterAndMovie;
