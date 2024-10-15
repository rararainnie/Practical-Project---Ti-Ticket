import redImage from "../assets/red.png";
import user from "../assets/user.png";

function Navbar() {
  return (
    <div>
      {/* Navbar */}
      <nav className="flex flex-col w-[60%] mx-auto">
        {/* Navbar - setting Logo and Text*/}
        <div className="flex items-center w-full mt-3">
          {/* Logo and Title - Centered */}
          <img className="w-12 h-12 ml-[40%]" src={redImage} alt="Logo" />
          <span className="text-red-500 text-2xl ">TI TICKET</span>

          {/* Register/Login UI - Right Aligned */}
          <img className="w-10 h-10 ml-auto mr-3 " src={user} alt="User Icon" />
          <button className="w-40 h-10 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-900 text-sm">
            เข้าสู่ระบบ/ลงทะเบียน
          </button>
        </div>
      </nav>
      {/* <div className="boarder border-[1px] border-red-500 opacity-40 mt-3"></div> */}
    </div>
  );
}

export default Navbar;
