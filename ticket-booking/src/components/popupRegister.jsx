import { useState } from "react";
import PropTypes from "prop-types";
import redImage from "../assets/red.png";
import googleLogo from "../assets/pic/google_logo.webp";

function RegisterPopup({ onClose, onOpenLogin }) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value) => {
    if (!value.endsWith("@gmail.com")) {
      setEmailError("อีเมลต้องลงท้ายด้วย @gmail.com");
    } else {
      setEmailError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !firstName || !lastName) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (emailError) {
      setError("กรุณาแก้ไขข้อผิดพลาดของอีเมล");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          FName: firstName,
          LName: lastName,
        }),
      });

      if (!response.ok) {
        throw new Error("การลงทะเบียนไม่สำเร็จ");
      }

      const data = await response.json();
      console.log("ลงทะเบียนสำเร็จ:", data);
      onClose(); // ปิด popup หลังจากลงทะเบียนสำเร็จ
      onOpenLogin(); // เปิด popup เข้าสู่ระบบ
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลงทะเบียน:", error);
      setError("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
    }
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

        <button className="w-full flex items-center justify-center gap-3 bg-white p-2 rounded-full hover:bg-gray-300 mt-3">
          <img className="w-6" src={googleLogo} alt="Google Logo" />
          <span className="text-black">Sign up with Google</span>
        </button>

        <h1 className="text-white text-center mt-3">หรือ</h1>

        <form onSubmit={handleRegister} className="flex flex-col space-y-4 mt-3 bg-zinc-800 p-5 rounded-2xl">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="text-white">อีเมล</label>
            <input
              type="email"
              placeholder="อีเมล"
              className={`mt-2 p-2 w-full border rounded-full ${emailError ? 'border-red-500' : ''}`}
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="text-white">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="mt-2 p-2 w-full border rounded-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-white">ชื่อ</label>
            <input
              type="text"
              placeholder="ชื่อ"
              className="mt-2 p-2 w-full border rounded-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-white">นามสกุล</label>
            <input
              type="text"
              placeholder="นามสกุล"
              className="mt-2 p-2 w-full border rounded-full mb-3"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <button type="submit" className="w-[50%] mx-auto bg-red-600 text-white py-2 rounded-full hover:bg-red-800">
            ลงทะเบียน
          </button>
        </form>

        <p className="text-center mt-4 text-white">
          เป็นสมาชิกอยู่แล้ว?{" "}
          <span className="text-red-500 cursor-pointer" onClick={onOpenLogin}>
            เข้าสู่ระบบ
          </span>
        </p>
      </div>
    </div>
  );
}

RegisterPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenLogin: PropTypes.func.isRequired,
};

export default RegisterPopup;
