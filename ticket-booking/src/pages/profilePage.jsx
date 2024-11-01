import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Buffer } from "buffer";
import { QRCodeSVG } from 'qrcode.react';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import './profilePage.css';

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
          <h1 className="text-2xl font-bold mb-4 text-yellow-500">
            การจองของฉัน
          </h1>
          <div className="p-4 bg-gray-800 grid grid-cols-3 gap-5 text-white rounded-2xl">
            {sortedBookings.length > 0 ? (
              sortedBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flip-card mb-4 h-[300px] cursor-pointer"
                  onClick={() => setFlippedCard(flippedCard === index ? null : index)}
                >
                  <div className={`flip-card-inner relative w-full h-full ${flippedCard === index ? 'flipped' : ''}`}>
                    {/* ด้านหน้า */}
                    <div className="flip-card-front p-4 rounded-2xl flex w-full h-full bg-gray-900 items-center">
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
                    <div className="flip-card-back p-4 rounded-2xl w-full h-full bg-gray-900 flex flex-col items-center justify-center">
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
                      {/* <p className="text-yellow-500 mt-4 text-center">
                        แสกน QR Code เพื่อดูรายละเอียดการจอง
                      </p> */}
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
