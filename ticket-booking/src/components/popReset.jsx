import PropTypes from "prop-types";
import redImage from "../assets/red.png";

function ResetPasswordPopup({ onClose, onOpenLogin }) {
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

        <div className="flex flex-col space-y-4 mt-3 bg-zinc-800 p-5 rounded-2xl">
          <h1 className="text-xl text-center text-white">FORGOT PASSWORD</h1>
          <div>
            <label className="text-white">อีเมล</label>
            <input
              type="email"
              placeholder="อีเมล"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          <div>
            <label className="text-white">รหัสผ่านใหม่</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="mt-2 p-2 w-full border rounded-full"
            />
          </div>

          <div>
            <label className="text-white">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="mt-2 p-2 w-full border rounded-full mb-3"
            />
          </div>

          <button
            className="w-[40%] mx-auto bg-red-600 text-white py-2 rounded-full hover:bg-red-800"
            onClick={onOpenLogin}
          >
            RESET PASSWORD
          </button>
        </div>
      </div>
    </div>
  );
}

ResetPasswordPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenLogin: PropTypes.func.isRequired,
};

export default ResetPasswordPopup;
