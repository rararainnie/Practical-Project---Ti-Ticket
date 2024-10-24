import PropTypes from "prop-types";
import redImage from "../assets/red.png";
import googleLogo from "../assets/pic/google_logo.webp";

function RegisterPopup({ onClose, onOpenLogin }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 1000 }}
    >
      <div className="bg-black p-5 w-[25%] rounded-2xl shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✖
        </button>

        <img className="w-15 h-15 mx-auto mt-3" src={redImage} alt="Logo" />
        <h1 className="text-2xl text-center text-red-500 mt-3">TI TICKET</h1>

        <button className="w-full flex items-center justify-center gap-3 bg-white p-2 rounded-full hover:bg-gray-300 mt-3">
          <img className="w-6" src={googleLogo} alt="Google Logo" />
          <span className="text-black">Sign up with Google</span>
        </button>

        <h1 className="text-white text-center mt-3">หรือ</h1>

        <div className="flex flex-col space-y-4 mt-3 bg-zinc-800 p-5 rounded-2xl">
          <div>
            <label className="text-white">อีเมล</label>
            <input
              type="email"
              placeholder="อีเมล"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          <div>
            <label className="text-white">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          <div>
            <label className="text-white">ชื่อ</label>
            <input
              type="text"
              placeholder="ชื่อ"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          <div>
            <label className="text-white">นามสกุล</label>
            <input
              type="text"
              placeholder="นามสกุล"
              className="mt-2 p-2 w-full border rounded-full mb-3"
            />
          </div>

          <button className="w-[50%] mx-auto bg-red-600 text-white py-2 rounded-full hover:bg-red-800">
            ลงทะเบียน
          </button>

          <p className="text-center mt-4 text-white">
            เป็นสมาชิกอยู่แล้ว?{" "}
            <span className="text-red-500 cursor-pointer" onClick={onOpenLogin}>
              เข้าสู่ระบบ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

RegisterPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenLogin: PropTypes.func.isRequired,
};

export default RegisterPopup;
