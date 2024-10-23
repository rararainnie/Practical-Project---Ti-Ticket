import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";
import MovieBox from "../components/MovieBox";
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

function Home() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    // ดึงข้อมูลจาก backend
    fetch('http://localhost:3001/movies')
      .then(response => response.json())
      .then(data => {
        // แปลงข้อมูลที่ได้รับให้เป็นรูปแบบที่ต้องการ
        const formattedMovies = data.map(movie => ({
          id: movie.MovieId,
          poster: `data:image/jpeg;base64,${Buffer.from(movie.Image).toString('base64')}`, // แปลง Buffer เป็น Base64
          title: movie.Title,
          genre: movie.Genre,
          rating: movie.Rating.toString(),
          duration: `${movie.Duration} นาที`,
          releaseDate: new Date(movie.ReleaseDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
          description: movie.Description,
        }));

        setMovies(formattedMovies);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />

      <div className="pt-1 w-[60%] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {movies.map((movie) => (
            <MovieBox
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
