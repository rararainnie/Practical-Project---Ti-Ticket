import PropTypes from "prop-types";
import redImage from "../assets/red.png";
import googleLogo from "../assets/pic/google_logo.webp";

function LoginPopup({ onClose, onOpenRegister }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 1000 }}
    >
      {/* กล่องใส่ข้อมูลทั้งหมด */}
      <div className="bg-black p-5 w-[25%] rounded-2xl shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Logo และหัวข้อ */}
        <img className="w-15 h-15 mx-auto mt-3" src={redImage} alt="Logo" />
        <h1 className="text-2xl text-center text-red-500 mt-3">TI TICKET</h1>

        <div className="flex flex-col space-y-4 mt-3 bg-zinc-800 p-5 rounded-2xl">
          {/* Email Input */}
          <div>
            <label className="text-white">อีเมล</label>
            <input
              type="email"
              placeholder="อีเมล"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-white">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          <button className="text-sm text-red-500 underline self-end">
            ลืมรหัสผ่าน?
          </button>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button className="w-[50%] mx-auto bg-red-600 text-white py-2 rounded-full hover:bg-red-800">
            เข้าสู่ระบบ
          </button>

          <h1 className="text-white text-center">หรือ</h1>

          {/* ปุ่ม Google */}
          <button className="w-full flex items-center justify-center gap-3 bg-white p-2 rounded-full hover:bg-gray-100">
            <img className="w-6" src={googleLogo} alt="Google Logo" />
            <span className="text-black">Sign up with Google</span>
          </button>

          {/* ลิงก์สมัครสมาชิก */}
          <p className="text-center mt-4 text-white">
            ยังไม่มีบัญชี?{" "}
            <span
              className="text-red-500 cursor-pointer"
              onClick={onOpenRegister}
            >
              สมัครสมาชิก
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

LoginPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenRegister: PropTypes.func.isRequired,
};

export default LoginPopup;
