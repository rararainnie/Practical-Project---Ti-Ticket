import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ShowSeats from "../components/showSeats";

function ShowTime({ movie, cinema, showTimes }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const seatsRef = useRef(null);
  const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    // รีเซ็ตค่าเมื่อ showTimes เปลี่ยนแปลง
    console.log(movie, cinema,"showtimes", showTimes);
    setSelectedInfo(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setCurrentIndex(0);
    generateDays();
  }, [movie, cinema, showTimes]);

  const generateDays = () => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const today = new Date();
    const upcomingDays = Array.from({ length: 32 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return {
        day: dayNames[date.getDay()],
        date: date.getDate(),
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        fullDate: date.toISOString().split("T")[0],
      };
    });

    setDays(upcomingDays);
  };

  const handleDateClick = (fullDate) => {
    setSelectedDate(fullDate);
    setSelectedInfo(null);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < days.length - 11) setCurrentIndex(currentIndex + 1);
  };

  const handleTimeClick = (timeCode, showDateTime, cinemaLocation, cinemaNo) => {
    setSelectedInfo({
      timeCode: timeCode,
      showDateTime: showDateTime,
      cinemaLocationName: cinemaLocation,
      cinemaNoName: cinemaNo
    });
    
    setTimeout(() => {
      if (seatsRef.current) {
        seatsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const filterShowTimesByDate = (showTimes, selectedDate) => {
    return showTimes.filter((showTime) => {
      const showTimeDate = new Date(showTime.ShowDateTime);
      return showTimeDate.toISOString().split("T")[0] === selectedDate;
    });
  };

  useEffect(() => {
    if (selectedInfo?.timeCode && seatsRef.current) {
      seatsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedInfo?.timeCode]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex border rounded-md p-2 bg-white w-full">
          <h1 className="flex-1 text-center">เลือกรอบภาพยนตร์</h1>
          <h1 className="flex-1 text-center">เลือกที่นั่ง</h1>
          <h1 className="flex-1 text-center">ซื้อตั๋ว</h1>
        </div>

        <div className="flex w-full items-center justify-between mt-5">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-white hover:bg-gray-200 hover:bg-opacity-20 text-xl p-3 rounded-md"
          >
            &lt;
          </button>

          <div className="flex gap-x-2">
            {days.slice(currentIndex, currentIndex + 11).map((day, index) => {
              const isToday =
                day.fullDate === new Date().toISOString().split("T")[0];
              return (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center rounded-md ${
                    day.fullDate === selectedDate
                      ? "bg-red-500 text-white"
                      : "bg-gray-800 text-yellow-500 hover:bg-gray-500"
                  }`}
                  style={{ width: "70px", height: "70px", flex: "0 0 auto" }}
                  onClick={() => handleDateClick(day.fullDate)}
                >
                  {isToday ? (
                    <>
                      <span className="text-sm font-bold">วันนี้</span>
                      <span className="text-lg font-bold">{day.date}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-semibold">
                        {day.month}
                      </span>
                      <span className="text-sm font-bold">{day.day}</span>
                      <span className="text-lg font-bold">{day.date}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= days.length - 11}
            className="text-white hover:bg-gray-200 hover:bg-opacity-20 text-xl p-3 rounded-md"
          >
            &gt;
          </button>
        </div>
      </div>
      {console.log("showTimes before", showTimes)}
      <div className="mt-8">
        {(showTimes.length === 0) ? ( 
          console.log("showtimes empty:", showTimes),
          <div className="flex items-center justify-center">
            <p className="text-xl text-yellow-500">ไม่พบรอบฉายสำหรับภาพยนตร์นี้</p>
          </div>
        ) : (
          console.log("showtimes has data:", showTimes),
          (() => {
            const filteredShowTimes = filterShowTimesByDate(
              showTimes,
              selectedDate
            );
            if (filteredShowTimes.length === 0) {
              return (
                <div className="flex items-center justify-center">
                  <p className="text-xl text-yellow-500">
                    ไม่พบรอบฉายสำหรับภาพยนตร์นี้ในวันที่เลือก
                  </p>
                </div>
              );
            }
            const groupedShowTimes = filteredShowTimes.reduce(
              (acc, showTime) => {
                if (!acc[showTime.CinemaLocationName]) {
                  acc[showTime.CinemaLocationName] = {
                    CinemaLocationId: showTime.CinemaLocationId,
                    CinemaLocationName: showTime.CinemaLocationName,
                    Cinemas: {},
                  };
                }
                if (
                  !acc[showTime.CinemaLocationName].Cinemas[
                    showTime.CinemaNoName
                  ]
                ) {
                  acc[showTime.CinemaLocationName].Cinemas[
                    showTime.CinemaNoName
                  ] = {
                    CinemaNo: showTime.CinemaNo,
                    CinemaNoName: showTime.CinemaNoName,
                    ShowTimes: [],
                  };
                }
                acc[showTime.CinemaLocationName].Cinemas[
                  showTime.CinemaNoName
                ].ShowTimes.push(showTime);
                return acc;
              },
              {}
            );

            return Object.values(groupedShowTimes).map(
              (location, locationIndex) => (
                <div
                  key={locationIndex}
                  className="bg-gray-800 rounded-lg p-4 mb-4"
                >
                  <h3 className="text-yellow-500 text-xl mb-2">
                    {location.CinemaLocationName}
                  </h3>
                  {Object.values(location.Cinemas).map(
                    (cinema, cinemaIndex) => (
                      <div key={cinemaIndex} className="mb-3">
                        <p className="text-white mb-2">{cinema.CinemaNoName}</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            ...new Set(
                              cinema.ShowTimes.map((time) => time.ShowDateTime)
                            ),
                          ]
                            .sort((a, b) => new Date(a) - new Date(b))
                            .map((showDateTime, timeIndex) => {
                              const showTime = new Date(showDateTime);
                              const currentTime = new Date();
                              const timeDifference =
                                currentTime.getTime() - showTime.getTime();
                              const minutesDifference =
                                timeDifference / (1000 * 60);
                              const isDisabled = minutesDifference >= 30;

                              // หา TimeCode ของเวลาที่ไม่ซ้ำกัน
                              const timeCode = cinema.ShowTimes.find(
                                (time) => time.ShowDateTime === showDateTime
                              ).TimeCode;

                              return (
                                <button
                                  key={timeIndex}
                                  className={`px-3 py-1 rounded ${
                                    isDisabled
                                      ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                                      : selectedInfo?.timeCode === timeCode
                                      ? "bg-red-500 text-white"
                                      : "bg-yellow-500 text-black hover:bg-red-600 hover:text-white"
                                  }`}
                                  onClick={() =>
                                    handleTimeClick(
                                      timeCode, 
                                      showDateTime,
                                      location.CinemaLocationName,
                                      cinema.CinemaNoName
                                    )
                                  }
                                  disabled={isDisabled}
                                >
                                  {showTime.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            );
          })()
        )}
      </div>
      {selectedInfo?.timeCode && showTimes.length > 0 && (
        <div ref={seatsRef}>
          <ShowSeats
            key={selectedInfo?.timeCode}
            timeCode={selectedInfo?.timeCode}
            showDateTime={selectedInfo?.showDateTime}
            movie={movie}
            cinemaLocationName={selectedInfo?.cinemaLocationName}
            cinemaNoName={selectedInfo?.cinemaNoName}
          />
        </div>
      )}
    </>
  );
}

ShowTime.propTypes = {
  movie: PropTypes.object.isRequired,
  cinema: PropTypes.object.isRequired,
  showTimes: PropTypes.array.isRequired,
};

export default ShowTime;
