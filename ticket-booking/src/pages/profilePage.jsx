import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Buffer } from "buffer";
import { QRCodeSVG } from 'qrcode.react';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function ProfilePage() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCard, setFlippedCard] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      if (currentUser) {
        await fetchBookings(currentUser.UserID);
      }
      setLoading(false);
    };

    loadBookings();
  }, [currentUser]);

  const fetchBookings = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/user/${userId}/bookings`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const sortedBookings = bookings.sort((a, b) => {
    return new Date(a.ShowDateTime) - new Date(b.ShowDateTime);
  });

  const generateQRData = (booking) => {
    const bookingInfo = {
      movieTitle: booking.MovieTitle,
      cinema: booking.CinemaLocationName,
      cinemaNo: booking.CinemaNoName,
      showTime: new Date(booking.ShowDateTime).toLocaleString(),
      seats: booking.SeatNames,
      totalPrice: booking.TotalPrice,
      customerName: `${currentUser.FName} ${currentUser.LName}`,
    };
    return JSON.stringify(bookingInfo);
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      {loading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-yellow-500 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto mt-8 p-4">
          <h1 className="text-2xl font-bold mb-4 text-yellow-500">การจองของฉัน</h1>
          <div className="p-4 bg-gray-800 grid grid-cols-3 gap-5 text-white rounded-2xl">
            {sortedBookings.length > 0 ? (
              sortedBookings.map((booking, index) => (
                <div
                  key={index}
                  className="relative h-[300px] w-full cursor-pointer perspective-[1000px]"
                  onClick={() => setFlippedCard(flippedCard === index ? null : index)}
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
                      flippedCard === index ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* ด้านหน้า */}
                    <div className="absolute w-full h-full backface-hidden bg-gray-900 p-4 rounded-2xl flex items-center">
                      {booking.MovieImage ? (
                        <img
                          src={`data:image/jpeg;base64,${Buffer.from(booking.MovieImage).toString("base64")}`}
                          alt={booking.MovieTitle}
                          className="w-32 h-48 object-cover mr-4"
                        />
                      ) : (
                        <div className="w-32 h-48 bg-gray-200 mr-4 flex items-center justify-center">
                          <span>ไม่มีรูปภาพ</span>
                        </div>
                      )}
                      <div>
                        <p><strong>ชื่อภาพยนตร์:</strong> {booking.MovieTitle}</p>
                        <p><strong>วันที่และเวลาฉาย:</strong> {new Date(booking.ShowDateTime).toLocaleString()}</p>
                        <p><strong>โรงภาพยนตร์:</strong> {booking.CinemaLocationName}</p>
                        <p><strong>โรง:</strong> {booking.CinemaNoName}</p>
                        <p><strong>ที่นั่ง:</strong> {booking.SeatNames}</p>
                        <p><strong>ราคา:</strong> {booking.TotalPrice} บาท</p>
                      </div>
                    </div>

                    {/* ด้านหลัง */}
                    <div className="absolute w-full h-full backface-hidden bg-gray-900 p-4 rounded-2xl flex flex-col items-center justify-center rotate-y-180">
                      <div className="bg-white p-4 rounded-lg">
                        <QRCodeSVG
                          value={generateQRData(booking)}
                          size={200}
                          level="H"
                          imageSettings={{
                            src: `data:image/jpeg;base64,${Buffer.from(booking.MovieImage).toString("base64")}`,
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>ไม่พบประวัติการจอง</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default ProfilePage;
