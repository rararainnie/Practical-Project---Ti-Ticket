import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetails from "./pages/movieDetails";
import ScrollToTop from "./components/scollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie-details/:movieName" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
