import Garfield_Poster from "../assets/moviePoster/The-Garfield-Movie(2024).jpg";
import TheLastOfUs_Poster from "../assets/moviePoster/The-last-of-us.jpg";
import Avengers from "../assets/moviePoster/Avengers.jpeg";
import HarryPotter from "../assets/moviePoster/harry_potter.jfif";
import InsideOut2 from "../assets/moviePoster/in-side-out-2.jpeg";
import Jaw from "../assets/moviePoster/Jaw.jfif";

const moviesData = [
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

export default moviesData;

// import moviesData from './DBMovies.json';

// const getMoviesData = () => {
//     return moviesData.movies;
// };

// export default getMoviesData;

// const [movies, setMovies] = useState([]);
//   useEffect(() => {
//     // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลภาพยนตร์
//     const data = getMoviesData();
//     setMovies(data);
//   }, []);