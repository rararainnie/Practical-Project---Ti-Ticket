import Navbar from "../components/navbar";
import RecommendMovie from "../components/recommendMovie";
import ShowTheaterAndMovie from "../components/showTheaterAndMovie";
import MovieBox from "../components/movieBox";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";

function Home() {
  const [movies, setMovies] = useState([]);
  const [underlined, setUnderlined] = useState(0);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = (index) => {
    setUnderlined(index);
    filterMovies(index, movies);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/movies');
        const data = await response.json();
        console.log("ข้อมูลที่ได้รับจาก API:", data);

        // จัดรูปแบบข้อมูล
        const formattedMovies = data.map((movie) => ({
          id: movie.MovieID,
          poster: `data:image/jpeg;base64,${Buffer.from(movie.Image).toString("base64")}`,
          title: movie.Title,
          genre: movie.Genre,
          rating: movie.Rating.toString(),
          duration: `${movie.Duration} นาที`,
          releaseDate: new Date(movie.ReleaseDate).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          date: new Date(movie.ReleaseDate),
          description: movie.Description,
        }));

        setMovies(formattedMovies);
        filterMovies(0, formattedMovies); // ใช้ฟังก์ชัน filterMovies แทน setFilteredMovies
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filterMovies = (index, movieList = movies) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // เซ็ตเวลาเป็น 00:00:00 เพื่อเปรียบเทียบเฉพาะวัน

    if (index === 0) {
      // กำลังฉาย: แสดงหนังที่วันฉายไม่เกินวันปัจจุบัน
      setFilteredMovies(
        movieList.filter((movie) => {
          const releaseDate = new Date(movie.date);
          releaseDate.setHours(0, 0, 0, 0);
          return releaseDate <= currentDate;
        })
      );
    } else {
      // โปรแกรมหน้า: แสดงหนังที่วันฉายเลยวันปัจจุบันไปแล้ว
      setFilteredMovies(
        movieList.filter((movie) => {
          const releaseDate = new Date(movie.date);
          releaseDate.setHours(0, 0, 0, 0);
          return releaseDate > currentDate;
        })
      );
    }
  };

  useEffect(() => {
    console.log("setMovies", movies);
    console.log("Filtered Movies:", filteredMovies);
  }, [filteredMovies, movies]);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <RecommendMovie />
      <ShowTheaterAndMovie />
      <div className="pt-1 w-[60%] mx-auto">
        <h1 className="text-red-500 text-3xl text-center">ภาพยนตร์</h1>
        <div className="text-white text-xl text-center space-x-10 mt-5 mb-5 ">
          <span
            className={`cursor-pointer hover:underline hover:decoration-red-400 hover:text-white ${
              underlined === 0
                ? "text-white underline decoration-red-400"
                : "text-gray-400"
            }`}
            onClick={() => handleClick(0)}
          >
            กำลังฉาย
          </span>

          <span
            className={`cursor-pointer hover:underline hover:decoration-red-400 hover:text-white ${
              underlined === 1
                ? "text-white underline decoration-red-400"
                : "text-gray-400"
            }`}
            onClick={() => handleClick(1)}
          >
            โปรแกรมหน้า
          </span>
        </div>
        {isLoading ? (
          // แยก loading spinner ออกมาจาก grid
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-yellow-500 text-lg">กำลังโหลดข้อมูลภาพยนตร์...</p>
            </div>
          </div>
        ) : filteredMovies.length > 0 ? (
          // แสดง grid ของภาพยนตร์
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredMovies.map((movie) => (
              <MovieBox key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          // แสดงข้อความไม่พบภาพยนตร์
          <div className="flex items-center justify-center">
            <p className="text-yellow-500 text-xl">ไม่พบภาพยนตร์</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
