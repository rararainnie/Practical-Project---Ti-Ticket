import { useState } from "react";
import PropTypes from "prop-types";
import redImage from "../assets/red.png";

function ResetPasswordPopup({ onClose, onOpenLogin }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsResetting(true);

    if (!email || !newPassword || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        throw new Error("การรีเซ็ตรหัสผ่านไม่สำเร็จ");
      }

      setSuccess("รีเซ็ตรหัสผ่านสำเร็จ กำลังนำคุณไปยังหน้า Login...");
      setTimeout(() => {
        onClose();
        onOpenLogin();
      }, 3000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:", error);
      setError("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้ง");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMatch(true);
      setIsResetting(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
    setPasswordMatch(newPassword === confirmPwd);
  };

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

        <form onSubmit={handleResetPassword} className="flex flex-col space-y-4 mt-3 bg-zinc-800 p-5 rounded-2xl">
          <h1 className="text-xl text-center text-white">FORGOT PASSWORD</h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <div>
            <label className="text-white">อีเมล</label>
            <input
              // type="email"
              placeholder="อีเมล"
              className="mt-2 p-2 w-full border rounded-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-white">รหัสผ่านใหม่</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="mt-2 p-2 w-full border rounded-full"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordMatch(e.target.value === confirmPassword);
              }}
            />
          </div>

          <div>
            <label className="text-white">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className={`mt-2 p-2 w-full border rounded-full mb-3 ${
                !passwordMatch && confirmPassword ? 'border-red-500' : ''
              }`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {!passwordMatch && confirmPassword && (
              <p className="text-red-500 text-sm mt-1">รหัสผ่านไม่ตรงกัน</p>
            )}
          </div>

          {!isResetting && (
            <button 
              type="submit" 
              className="w-[40%] mx-auto bg-red-600 text-white py-2 rounded-full hover:bg-red-800"
              disabled={!passwordMatch}
            >
              RESET PASSWORD
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

ResetPasswordPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenLogin: PropTypes.func.isRequired,
};

export default ResetPasswordPopup;
