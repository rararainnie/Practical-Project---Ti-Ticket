import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Buffer } from "buffer";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function ProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndBookings = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser && !currentUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        await fetchBookings(parsedUser.UserID);
      } else if (currentUser) {
        await fetchBookings(currentUser.UserID);
      }
      setLoading(false);
    };

    loadUserAndBookings();
  }, [currentUser, setCurrentUser]);

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
                  className="mb-4 p-4 rounded-2xl flex w-full bg-gray-900 items-center"
                >
                  {booking.MovieImage ? (
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(
                        booking.MovieImage
                      ).toString("base64")}`}
                      alt={booking.MovieTitle}
                      className="w-32 h-48 object-cover mr-4"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-gray-200 mr-4 flex items-center justify-center">
                      <span>ไม่มีรูปภาพ</span>
                    </div>
                  )}
                  <div>
                    <p>
                      <strong>ชื่อภาพยนตร์:</strong> {booking.MovieTitle}
                    </p>
                    <p>
                      <strong>วันที่และเวลาฉาย:</strong>{" "}
                      {new Date(booking.ShowDateTime).toLocaleString()}
                    </p>
                    <p>
                      <strong>โรงภาพยนตร์:</strong> {booking.CinemaLocationName}
                    </p>
                    <p>
                      <strong>โรง:</strong> {booking.CinemaNoName}
                    </p>
                    <p>
                      <strong>ที่นั่ง:</strong> {booking.SeatNames}
                    </p>
                    <p>
                      <strong>ราคา:</strong> {booking.TotalPrice} บาท
                    </p>
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
