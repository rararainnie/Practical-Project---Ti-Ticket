import { useState, useEffect, useCallback, useRef } from "react";

import Garfield_Poster from "../assets/moviePoster/The-Garfield-Movie(2024).jpg";
import TheLastOfUs_Poster from "../assets/moviePoster/The-last-of-us.jpg";
import Avengers from "../assets/moviePoster/Avengers.jpeg";
import HarryPotter from "../assets/moviePoster/harry_potter.jfif";
import InsideOut2 from "../assets/moviePoster/in-side-out-2.jpeg";
import Jaw from "../assets/moviePoster/Jaw.jfif";

const movies = [
  {
    poster: Garfield_Poster,
    title: "The Garfield Movie",
    genre: "Animation",
    rating: "8",
    duration: "140 นาที",
    releaseDate: "14 ตุลาคม 2024",
  },
  {
    poster: TheLastOfUs_Poster,
    title: "The Last of Us",
    genre: "Drama",
    rating: "9",
    duration: "120 นาที",
    releaseDate: "22 ธันวาคม 2024",
  },
  {
    poster: Avengers,
    title: "Avengers",
    genre: "Action",
    rating: "10",
    duration: "180 นาที",
    releaseDate: "1 มกราคม 2025",
  },
  {
    poster: HarryPotter,
    title: "Harry Potter",
    genre: "Fantasy",
    rating: "8",
    duration: "150 นาที",
    releaseDate: "10 พฤศจิกายน 2024",
  },
  {
    poster: InsideOut2,
    title: "In Side Out 2",
    genre: "Animation",
    rating: "8",
    duration: "140 นาที",
    releaseDate: "14 ตุลาคม 2024",
  },
  {
    poster: Jaw,
    title: "Jaw",
    genre: "Horror",
    rating: "7",
    duration: "120 นาที",
    releaseDate: "5 กันยายน 2024",
  },
];

function RecommendMovie() {
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const currentMovie = movies[currentPosterIndex];
  const intervalRef = useRef(null);

  const handleNext = useCallback(() => {
    setCurrentPosterIndex((prevIndex) => (prevIndex + 1) % movies.length);
    resetInterval();
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentPosterIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
    resetInterval();
  }, []);

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 10000);
  };

  useEffect(() => {
    resetInterval();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex justify-center items-center mt-3 relative">
      <div className="w-full max-w-[60%] h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={currentMovie.poster}
          alt="Movie Poster"
          className="absolute w-[83%] h-full object-cover transition-opacity duration-500 ease-in-out"
        />
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="absolute left-40 w-[5%] h-[100%] bg-black bg-opacity-10 hover:bg-gray-200 hover:bg-opacity-30  text-white text-2xl text-opacity-70 hover:text-opacity-100"
        >
          &lt; {/* or any icon */}
        </button>
        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-40 w-[5%] h-[100%] bg-black bg-opacity-10  hover:bg-gray-200  hover:bg-opacity-20 text-white text-2xl text-opacity-70 hover:text-opacity-100"
        >
          &gt; {/* or any icon */}
        </button>

        {/* Detail Poster */}
        <div className="w-[50%] absolute flex flex-col text-white p-4 bg-black bg-opacity-20 rounded-md bottom-10">
          <h1 className="font-bold text-xl mb-2">{currentMovie.title}</h1>
          <h2 className="font-semibold text-sm mb-5">
            หมวดหมู่: {currentMovie.genre} | เรทผู้ชม: {currentMovie.rating} |{" "}
            {currentMovie.duration} | วันที่เข้าฉาย: {currentMovie.releaseDate}
          </h2>
          <button className="bg-blue-400 w-40 h-12 font-semibold rounded-sm hover:bg-blue-900 text-sm">
            จองตั๋วภาพยนตร์
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendMovie;
