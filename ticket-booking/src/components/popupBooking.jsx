import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContext";
import { QRCodeSVG } from 'qrcode.react';
import PaymentOptions from './PaymentOptions';

function BookingConfirmationPopup({ bookingData, onClose }) {
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [isPaid, setIsPaid] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60);

  useEffect(() => {
    // ถ้า isSuccess เป็น true ไม่ต้องเริ่มตัวจับเวลา
    if (isSuccess) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // cleanup function
    return () => clearInterval(timer);
  }, [onClose, isSuccess]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
    setError(null);
    try {
      await Promise.all(
        bookingData.selectedSeats.map((seat) =>
          updateSeatStatus(seat.SeatCode, "unavailable")
        )
      );
      setIsSuccess(true);
    } catch (err) {
      setError("ไม่สามารถยืนยันการจองได้ กรุณาลองใหม่อีกครั้ง", err);
    }
  };

  const handleBookingSuccess = () => {
    window.location.href = "/";
  };

  // สร้างข้อมูลสำหรับ QR Code
  const generateQRData = () => {
    const bookingInfo = {
      movieTitle: bookingData.movie.title,
      cinema: bookingData.cinemaLocationName,
      cinemaNo: bookingData.cinemaNoName,
      showTime: new Date(bookingData.showDateTime).toLocaleString(),
      seats: bookingData.selectedSeats.map(seat => seat.SeatName).join(", "),
      totalPrice: bookingData.totalPrice.toFixed(2),
      bookingDate: new Date().toLocaleString(),
      customerName: `${currentUser.FName} ${currentUser.LName}`,
    };
    
    // สร้าง URL ที่มีข้อมูลตั๋ว
    const ticketData = encodeURIComponent(JSON.stringify(bookingInfo));
    return `${window.location.origin}/ticket?data=${ticketData}`;
  };

  const handlePaymentComplete = (success) => {
    if (success) {
      // setIsPaid(true);
      handleConfirmBooking();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">
          {isSuccess ? "การจองสำเร็จ" : "ยืนยันการจองที่นั่ง"}
        </h2>

        <div className="space-y-3 text-white">
          <p>ภาพยนตร์: {bookingData.movie.title}</p>
          <p>โรงภาพยนตร์: {bookingData.cinemaLocationName}</p>
          <p>โรงที่: {bookingData.cinemaNoName}</p>
          <p>รอบฉาย: {new Date(bookingData.showDateTime).toLocaleString()}</p>
          <p>ที่นั่งที่เลือก: {bookingData.selectedSeats.map(seat => seat.SeatName).join(", ")}</p>
          <p>ราคารวม: {bookingData.totalPrice.toFixed(2)} บาท</p>
        </div>

        {!isSuccess && (
          <PaymentOptions
            totalAmount={bookingData.totalPrice}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        {isSuccess && (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-green-500 mb-4 text-center">การจองสำเร็จ!</p>
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value={generateQRData()}
                size={200}
                level="H"
                imageSettings={{
                  src: bookingData.movie.poster,
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
            {/* <p className="text-yellow-500 mt-2 text-sm text-center">
              แสกน QR Code เพื่อดูรายละเอียดการจอง
            </p> */}
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="flex justify-end space-x-4 mt-6">
          {isSuccess ? (
            <button
              onClick={handleBookingSuccess}
              className="w-full px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              กลับหน้าหลัก
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ยกเลิก
            </button>
          )}
        </div>

        {!isSuccess && (
          <div className="text-yellow-500 text-center mb-4">
            เวลาที่เหลือในการชำระเงิน: {formatTime(timeRemaining)}
          </div>
        )}
      </div>
    </div>
  );
}

BookingConfirmationPopup.propTypes = {
  bookingData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  timeLimit: PropTypes.number.isRequired,
};

export default BookingConfirmationPopup;
