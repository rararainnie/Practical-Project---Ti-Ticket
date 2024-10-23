import { useState } from "react";
import LoginPopup from "../components/popupLogin";
import RegisterPopup from "../components/popupRegister";
import redImage from "../assets/red.png";
import user from "../assets/user.png";

function Navbar() {
  const [activePopup, setActivePopup] = useState(null); // Track which popup is open

  const openLogin = () => setActivePopup("login");
  const openRegister = () => setActivePopup("register");
  const closePopups = () => setActivePopup(null); // Close any open popup

  return (
    <div>
      <nav className="flex flex-col w-[60%] mx-auto">
        <div className="flex items-center w-full mt-3">
          <img className="w-12 h-12 ml-[40%]" src={redImage} alt="Logo" />
          <span className="text-red-500 text-2xl">TI TICKET</span>

          <img className="w-10 h-10 ml-auto mr-3" src={user} alt="User Icon" />
          <button
            className="w-40 h-10 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-900 text-sm"
            onClick={openLogin}
          >
            เข้าสู่ระบบ/ลงทะเบียน
          </button>
        </div>
      </nav>

      {/* Login Popup */}
      {activePopup === "login" && (
        <LoginPopup onClose={closePopups} onOpenRegister={openRegister} />
      )}

      {/* Register Popup */}
      {activePopup === "register" && (
        <RegisterPopup onClose={closePopups} onOpenLogin={openLogin} />
      )}
    </div>
  );
}

export default Navbar;
