import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  if (!bookingData) {
    return <div>ไม่พบข้อมูลการจอง</div>;
  }

  const updateSeatStatus = async (seatCode, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/seat/${seatCode}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Status: newStatus }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update seat status: ${errorText}`);
      }

      const result = await response.text();
      console.log(result); // แสดงผลลัพธ์จาก server
    } catch (error) {
      console.error('Error updating seat status:', error);
      throw error;
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Selected seats:', bookingData.selectedSeats); // เพิ่ม log นี้
      await Promise.all(bookingData.selectedSeats.map(seat => {
        console.log('Updating seat:', seat.SeatCode); // เพิ่ม log นี้
        return updateSeatStatus(seat.SeatCode, 'unavailable');
      }));

      // ทำการบันทึกข้อมูลการจองลงในฐานข้อมูล (ถ้ามี)
      // ...

      setIsBookingConfirmed(true);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการยืนยันการจอง:", err);
      setError("ไม่สามารถยืนยันการจองได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">
        {isBookingConfirmed ? "การจองสำเร็จ" : "ยืนยันการจองที่นั่ง"}
      </h1>
      <div className="bg-white p-4 rounded shadow">
        <p>รอบฉาย: {new Date(bookingData.showDateTime).toLocaleString()}</p>
        <p>ที่นั่งที่เลือก: {bookingData.selectedSeats.map(seat => seat.SeatName).join(', ')}</p>
        <p>ราคารวม: {bookingData.totalPrice.toFixed(2)} บาท</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isBookingConfirmed ? (
          <div>
            <p className="text-green-500 mt-2">การจองสำเร็จแล้ว!</p>
            <button
              onClick={handleBackToHome}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              กลับหน้าหลัก
            </button>
          </div>
        ) : (
          <button
            onClick={handleConfirmBooking}
            disabled={isLoading}
            className={`mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันการจอง'}
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingConfirmation;
