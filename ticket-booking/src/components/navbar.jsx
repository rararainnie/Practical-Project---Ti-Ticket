import { useState } from "react";
import LoginPopup from "../components/popupLogin";
import RegisterPopup from "../components/popupRegister";
import ResetPasswordPopup from "../components/popReset";
import redImage from "../assets/red.png";
import user from "../assets/user.png";

function Navbar() {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (popupName) => setActivePopup(popupName);
  const closePopup = () => setActivePopup(null);

  return (
    <div>
      <nav className="flex flex-col w-[60%] mx-auto">
        <div className="flex items-center w-full mt-3">
          <img className="w-12 h-12 ml-[40%]" src={redImage} alt="Logo" />
          <span className="text-red-500 text-2xl">TI TICKET</span>
          <img className="w-10 h-10 ml-auto mr-3" src={user} alt="User Icon" />
          <button
            className="w-40 h-10 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-900 text-sm"
            onClick={() => openPopup("login")}
          >
            เข้าสู่ระบบ/ลงทะเบียน
          </button>
        </div>
      </nav>

      {activePopup === "login" && (
        <LoginPopup
          onClose={closePopup}
          onOpenRegister={() => openPopup("register")}
          onOpenResetPassword={() => openPopup("resetPassword")}
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
