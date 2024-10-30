import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";

function BookingConfirmationPopup({ bookingData, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const updateSeatStatus = async (seatCode, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3001/seat/${seatCode}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Status: newStatus,
            UserID: currentUser.UserID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update seat status");
      }
    } catch (error) {
      console.error("Error updating seat status:", error);
      throw error;
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all(
        bookingData.selectedSeats.map((seat) =>
          updateSeatStatus(seat.SeatCode, "unavailable")
        )
      );
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm();
      }, 1500);
    } catch (err) {
      setError("ไม่สามารถยืนยันการจองได้ กรุณาลองใหม่อีกครั้ง", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          {isSuccess ? "การจองสำเร็จ" : "ยืนยันการจองที่นั่ง"}
        </h2>

        <div className="space-y-3 text-white">
          <p>
            ผู้ใช้: {currentUser.FName} {currentUser.LName}
          </p>
          <p>ภาพยนตร์: {bookingData.movie.title}</p>
          <p>โรงภาพยนตร์: {bookingData.cinemaLocationName}</p>
          <p>โรงที่: {bookingData.cinemaNoName}</p>
          <p>รอบฉาย: {new Date(bookingData.showDateTime).toLocaleString()}</p>
          <p>
            ที่นั่งที่เลือก:{" "}
            {bookingData.selectedSeats.map((seat) => seat.SeatName).join(", ")}
          </p>
          <p>ราคารวม: {bookingData.totalPrice.toFixed(2)} บาท</p>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {isSuccess && (
          <p className="text-green-500 mt-4 text-center">การจองสำเร็จ!</p>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {isSuccess ? (
            <button
              onClick={onConfirm}
              className="w-full px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              กลับหน้าหลัก
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                disabled={isLoading}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 disabled:bg-gray-400"
              >
                {isLoading ? "กำลังดำเนินการ..." : "ยืนยันการจอง"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

BookingConfirmationPopup.propTypes = {
  bookingData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default BookingConfirmationPopup;
