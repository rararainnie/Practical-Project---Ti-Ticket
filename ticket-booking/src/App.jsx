import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieDetails from "./pages/movieDetails";
import MovieReservation from "./pages/movieReservation";
import ScrollToTop from "./components/scollToTop";
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './pages/profilePage';
import AdminPage from './pages/adminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie-details/:movieName" element={<MovieDetails />} />
          <Route path="/movie-reservation/:movieName" element={<MovieReservation />} />
          <Route path="/profile/:userFName" element={<ProfilePage />} />
          <Route path="/adminPage/:adminFName" element={<AdminPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
