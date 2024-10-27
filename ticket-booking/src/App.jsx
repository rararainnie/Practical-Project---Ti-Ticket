import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetails from "./pages/movieDetails";
import MovieReservation from "./pages/movieReservation";
import ScrollToTop from "./components/scollToTop";
import BookingConfirmation from "./pages/BookingConfirmation";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie-details/:movieName" element={<MovieDetails />} />
          <Route path="/movie-reservation/:movieName" element={<MovieReservation />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
