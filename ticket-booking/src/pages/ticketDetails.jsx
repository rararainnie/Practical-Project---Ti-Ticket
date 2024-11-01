import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function TicketDetails() {
  const [searchParams] = useSearchParams();
  const [ticketInfo, setTicketInfo] = useState(null);

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      const decodedData = decodeURIComponent(data);
      setTicketInfo(JSON.parse(decodedData));
    } catch (error) {
      console.error('Invalid ticket data:', error);
    }
  }, [searchParams]);

  if (!ticketInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">ไม่พบข้อมูลตั๋วภาพยนตร์</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">E-Ticket</h1>
          
          <div className="space-y-4 text-white">
            <div>
              <h2 className="text-lg font-semibold text-yellow-500">ภาพยนตร์</h2>
              <p>{ticketInfo.movieTitle}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-yellow-500">สถานที่</h2>
              <p>{ticketInfo.cinema}</p>
              <p>โรงที่: {ticketInfo.cinemaNo}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-yellow-500">รอบฉาย</h2>
              <p>{ticketInfo.showTime}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-yellow-500">ที่นั่ง</h2>
              <p>{ticketInfo.seats}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-yellow-500">ราคา</h2>
              <p>{ticketInfo.totalPrice} บาท</p>
            </div>

            <div className="border-t border-gray-600 pt-4">
              <p className="text-sm text-gray-400">วันที่จอง: {ticketInfo.bookingDate}</p>
              <p className="text-sm text-gray-400">ผู้จอง: {ticketInfo.customerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails; 