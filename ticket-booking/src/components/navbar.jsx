import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPopup from "../components/popupLogin";
import RegisterPopup from "../components/popupRegister";
import ResetPasswordPopup from "../components/popReset";
import redImage from "../assets/red.png";
import user from "../assets/user.png";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [activePopup, setActivePopup] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const openPopup = (popupName) => setActivePopup(popupName);
  const closePopup = () => setActivePopup(null);

  const handleLogoClick = () => {
    navigate(`/`);
  };

  const handleLoginSuccess = (userData) => {
    if (userData.Status === 'Admin') {
      navigate('/admin');
    }
    closePopup();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <nav className="flex flex-col w-[60%] mx-auto">
        <div className="flex items-center w-full mt-3">
          <img
            className="w-12 h-12 ml-[40%] cursor-pointer"
            src={redImage}
            alt="Logo"
            onClick={handleLogoClick}
          />
          <span className="text-red-500 text-2xl cursor-pointer"
            onClick={handleLogoClick}
          > TI TICKET </span>
          <img className="w-10 h-10 ml-auto mr-3" src={user} alt="User Icon" />
          {currentUser ? (
            <div className="text-white">
              <span>{`${currentUser.FName} ${currentUser.LName}`}</span>
              <button
                className="ml-4 bg-red-700 text-white px-3 py-1 rounded-xl hover:bg-red-900"
                onClick={handleLogout}
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              className="w-40 h-10 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-900 text-sm"
              onClick={() => openPopup("login")}
            >
              เข้าสู่ระบบ/ลงทะเบียน
            </button>
          )}
        </div>
      </nav>

      {activePopup === "login" && (
        <LoginPopup
          onClose={closePopup}
          onOpenRegister={() => openPopup("register")}
          onOpenResetPassword={() => openPopup("resetPassword")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {activePopup === "register" && (
        <RegisterPopup
          onClose={closePopup}
          onOpenLogin={() => openPopup("login")}
        />
      )}

      {activePopup === "resetPassword" && (
        <ResetPasswordPopup
          onClose={closePopup}
          onOpenLogin={() => openPopup("login")}
        />
      )}
    </div>
  );
}

export default Navbar;
