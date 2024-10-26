import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function ShowSeats({ timeCode, showDateTime }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3001/showtime/${timeCode}/seats`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setSeats(data);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง:", err);
        setError("ไม่สามารถโหลดข้อมูลที่นั่งได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    if (timeCode) {
      fetchSeats();
    }
  }, [timeCode]);

  const handleSeatClick = (seat) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.some((s) => s.SeatCode === seat.SeatCode)) {
        return prevSelectedSeats.filter((s) => s.SeatCode !== seat.SeatCode);
      } else {
        return [...prevSelectedSeats, seat];
      }
    });
  };

  const renderSeats = () => {
    const rows = [...new Set(seats.map((seat) => seat.SeatName[0]))].sort();
    return rows.map((row) => (
      <div key={row} className="flex justify-center my-2">
        <span className="w-8 text-center">{row}</span>
        {seats
          .filter((seat) => seat.SeatName.startsWith(row))
          .sort(
            (a, b) =>
              parseInt(a.SeatName.slice(1)) - parseInt(b.SeatName.slice(1))
          )
          .map((seat) => (
            <button
              key={seat.SeatCode}
              className={`w-8 h-8 mx-1 rounded ${
                seat.Status === "available"
                  ? selectedSeats.some((s) => s.SeatCode === seat.SeatCode)
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              onClick={() =>
                seat.Status === "available" && handleSeatClick(seat)
              }
              disabled={seat.Status !== "available"}
            >
              {seat.SeatName.slice(1)}
            </button>
          ))}
      </div>
    ));
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce(
      (total, seat) => total + parseFloat(seat.Price),
      0
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง");
      return;
    }

    const bookingData = {
      timeCode,
      showDateTime,
      selectedSeats,
      totalPrice: calculateTotalPrice(),
    };

    navigate("/booking-confirmation", { state: bookingData });
  };

  if (loading)
    return <p className="text-white text-center">กำลังโหลดข้อมูลที่นั่ง...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (seats.length === 0)
    return <p className="text-white text-center">ไม่พบข้อมูลที่นั่ง</p>;

  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl text-center mb-4">เลือกที่นั่ง</h2>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="w-full h-12 bg-gray-700 mb-8 flex items-center justify-center text-white">
          จอภาพ
        </div>
        {renderSeats()}
      </div>
      <div className="mt-4 text-white">
        <p>รอบฉาย: {new Date(showDateTime).toLocaleString()}</p>
        <p>
          ที่นั่งที่เลือก:{" "}
          {selectedSeats.map((seat) => seat.SeatName).join(", ")}
        </p>
        <p>ราคารวม: {calculateTotalPrice().toFixed(2)} บาท</p>
      </div>
      <button
        onClick={handleBooking}
        className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={selectedSeats.length === 0}
      >
        จองที่นั่ง
      </button>
    </div>
  );
}

ShowSeats.propTypes = {
  timeCode: PropTypes.number.isRequired,
  showDateTime: PropTypes.string.isRequired,
};

export default ShowSeats;
