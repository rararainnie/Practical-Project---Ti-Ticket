import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function DataTable({ data, type, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);

  const [formData, setFormData] = useState({
    MovieID: "",
    Title: "",
    Description: "",
    Image: null,
    Genre: "",
    Rating: "",
    Duration: "",
    ReleaseDate: "",

    CinemaLocationCode: "",
    Name: "",
    Zone_ZoneID: "",

    TimeCode: "",
    ShowDateTime: "",
  });

  const getHeaders = () => {
    switch (type) {
      case "movies":
        return [
          "ID",
          "ชื่อเรื่อง",
          "ประเภท",
          "เรทติ้ง",
          "ระยะเวลา",
          "วันที่ฉาย",
          "การจัดการ",
        ];
      case "cinemas":
        return ["รหัส", "ชื่อโรงภาพยนตร์", "โซน", "การจัดการ"];
      case "showtimes":
        return ["รหัส", "ภาพยนตร์", "โรงภาพยนตร์", "วันและเวลา", "การจัดการ"];
      case "users":
        return ["ID", "อีเมล", "ชื่อ", "นามสกุล", "สถานะ", "การจัดการ"];
      default:
        return [];
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/admin/${type}/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          onRefresh();
        } else {
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const renderRow = (item) => {
    switch (type) {
      case "movies":
        return (
          <tr key={item.MovieID} className="border-b border-gray-700">
            <td className="px-4 py-2 text-white">{item.MovieID}</td>
            <td className="px-4 py-2 text-white">{item.Title}</td>
            <td className="px-4 py-2 text-white">{item.Genre}</td>
            <td className="px-4 py-2 text-white">{item.Rating}</td>
            <td className="px-4 py-2 text-white">{item.Duration} นาที</td>
            <td className="px-4 py-2 text-white">
              {new Date(item.ReleaseDate).toLocaleDateString("th-TH")}
            </td>
            <td className="px-4 py-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingId(item.MovieID)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item.MovieID)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </td>
          </tr>
        );
      case "cinemas":
        return (
          <tr
            key={item.CinemaLocationCode}
            className="border-b border-gray-700"
          >
            <td className="px-4 py-2 text-white">{item.CinemaLocationCode}</td>
            <td className="px-4 py-2 text-white">{item.Name}</td>
            <td className="px-4 py-2 text-white">{item.ZoneName}</td>
            <td className="px-4 py-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingId(item.CinemaLocationCode)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item.CinemaLocationCode)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </td>
          </tr>
        );
      case "showtimes":
        return (
          <tr key={item.TimeCode} className="border-b border-gray-700">
            <td className="px-4 py-2 text-white">{item.TimeCode}</td>
            <td className="px-4 py-2 text-white">{item.MovieTitle}</td>
            <td className="px-4 py-2 text-white">{item.CinemaName}</td>
            <td className="px-4 py-2 text-white">
              {new Date(item.ShowDateTime).toLocaleString("th-TH")}
            </td>
            <td className="px-4 py-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingId(item.TimeCode)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item.TimeCode)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </td>
          </tr>
        );
      case "users":
        return (
          <tr key={item.UserID} className="border-b border-gray-700">
            <td className="px-4 py-2 text-white">{item.UserID}</td>
            <td className="px-4 py-2 text-white">{item.Email}</td>
            <td className="px-4 py-2 text-white">{item.FName}</td>
            <td className="px-4 py-2 text-white">{item.LName}</td>
            <td className="px-4 py-2 text-white">{item.Status}</td>
            <td className="px-4 py-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingId(item.UserID)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item.UserID)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Image: file });
    }
  };

  const handleFormSubmit_Movie = async () => {
    const formDataObj = new FormData();

    const lastMovieID = data.reduce(
      (maxId, movie) => Math.max(maxId, movie.MovieID || 0),
      0
    );
    const newMovieID = lastMovieID + 1;

    formDataObj.append("MovieID", newMovieID);

    formDataObj.append("Title", formData.Title || "");
    formDataObj.append("Description", formData.Description || "");
    formDataObj.append("Image", formData.Image || "");
    formDataObj.append("Genre", formData.Genre || "");
    formDataObj.append("Rating", formData.Rating || "");
    formDataObj.append("Duration", formData.Duration || "");
    formDataObj.append("ReleaseDate", formData.ReleaseDate || "");

    try {
      const response = await fetch(`http://localhost:3001/admin/${type}`, {
        method: "POST",
        body: formDataObj,
      });
      if (response.ok) {
        onRefresh();
        setShowPopup(false);
      } else {
        alert("Error adding new data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding new data");
    }
  };

  const handleFormSubmit_Cinema = async () => {
    const formDataObj = new FormData();

    const lastCinemaLocationCode = data.reduce(
      (maxId, cinemas) => Math.max(maxId, cinemas.CinemaLocationCode || 0),
      0
    );
    const newCinemaLocationCode = lastCinemaLocationCode + 1;

    formDataObj.append("CinemaLocationCode", newCinemaLocationCode);

    formDataObj.append("Name", formData.Name || "");
    formDataObj.append("Zone_ZoneID", formData.Zone_ZoneID || "");

    try {
      const response = await fetch(`http://localhost:3001/admin/${type}`, {
        method: "POST",
        body: formDataObj,
      });
      if (response.ok) {
        onRefresh();
        setShowPopup(false);
      } else {
        alert("Error adding new data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding new data");
    }
  };

  useEffect(() => {
    if (showPopup && type === "showtimes") {
      fetchMoviesAndCinemas();
    }
  }, [showPopup, type]);

  const fetchMoviesAndCinemas = async () => {
    try {
      const moviesResponse = await fetch("http://localhost:3001/admin/movies");
      const cinemasResponse = await fetch(
        "http://localhost:3001/admin/cinemas"
      );

      const moviesData = await moviesResponse.json();
      const cinemasData = await cinemasResponse.json();

      setMovies(moviesData);
      setCinemas(cinemasData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSubmit_Showtime = async () => {
    const formDataObj = new FormData();

    const lastTimeCode = data.reduce(
      (maxId, showtimes) => Math.max(maxId, showtimes.TimeCode || 0),
      0
    );
    const newTimeCode = lastTimeCode + 1;

    formDataObj.append("TimeCode", newTimeCode);

    formDataObj.append("ShowDateTime", formData.ShowDateTime || "");
    formDataObj.append("MovieID", formData.MovieID || "");
    formDataObj.append("CinemaLocationCode", formData.CinemaLocationCode);
    formDataObj.append("Zone_ZoneID", formData.Zone_ZoneID || "");

    try {
      const response = await fetch(`http://localhost:3001/admin/showtimes`, {
        method: "POST",
        body: formDataObj,
      });
      if (response.ok) {
        onRefresh();
        setShowPopup(false);
      } else {
        alert("Error adding new showtime");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding new showtime");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          เพิ่มข้อมูลใหม่
        </button>
      </div>

      <div>
        <table className="min-w-full bg-gray-900 rounded-lg">
          <thead>
            <tr className="bg-gray-800">
              {getHeaders().map((header, index) => (
                <th key={index} className="px-4 py-2 text-left text-yellow-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map(renderRow)}</tbody>
        </table>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl mb-4">เพิ่มข้อมูลใหม่</h2>
            <form>
              {type === "movies" && (
                <>
                  <input
                    type="text"
                    name="Title"
                    placeholder="ชื่อเรื่อง"
                    value={formData.Title}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                  <input
                    type="text"
                    name="Description"
                    placeholder="คำอธิบาย"
                    value={formData.Description}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                  <input
                    type="file"
                    name="Image"
                    onChange={handleImageUpload}
                    className="mb-2 block w-full"
                  />
                  <input
                    type="text"
                    name="Genre"
                    placeholder="ประเภท"
                    value={formData.Genre}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                  <input
                    type="text"
                    name="Rating"
                    placeholder="เรทติ้ง"
                    value={formData.Rating}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                  <input
                    type="number"
                    name="Duration"
                    placeholder="ระยะเวลา (นาที)"
                    value={formData.Duration}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                  <input
                    type="date"
                    name="ReleaseDate"
                    value={formData.ReleaseDate}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                </>
              )}

              {type === "cinemas" && (
                <>
                  <input
                    type="text"
                    name="Name"
                    placeholder="ชื่อสถานที่โรงภาพยนตร์"
                    value={formData.Name}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                  <select
                    name="Zone_ZoneID"
                    value={formData.Zone_ZoneID}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  >
                    <option value="">เลือกภาค</option>
                    <option value="1">ภาคเหนือ</option>
                    <option value="2">ภาคใต้</option>
                    <option value="3">ภาคตะวันออก</option>
                    <option value="4">ภาคตะวันตก</option>
                    <option value="5">ภาคกลาง</option>
                  </select>
                </>
              )}

              {type === "showtimes" && (
                <>
                  <select
                    name="CinemaLocationCode"
                    value={formData.CinemaLocationCode}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  >
                    <option value="">เลือกโรงภาพยนตร์</option>
                    {cinemas.map((cinema) => (
                      <option
                        key={cinema.CinemaLocationCode}
                        value={cinema.CinemaLocationCode}
                      >
                        {cinema.Name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="MovieID"
                    value={formData.MovieID}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  >
                    <option value="">เลือกภาพยนตร์</option>
                    {movies.map((movie) => (
                      <option key={movie.MovieID} value={movie.MovieID}>
                        {movie.Title}
                      </option>
                    ))}
                  </select>

                  <input
                    type="datetime-local"
                    name="ShowDateTime"
                    value={formData.ShowDateTime}
                    onChange={handleFormChange}
                    className="mb-2 block w-full"
                  />
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  type === "movies"
                    ? handleFormSubmit_Movie()
                    : type === "cinemas"
                    ? handleFormSubmit_Cinema()
                    : handleFormSubmit_Showtime();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                บันทึก
              </button>

              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
              >
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
      )}
      {/* TODO: Add EditModal component for editing data */}
      {editingId && <div>{/* Add your edit modal/form component here */}</div>}
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOf(["movies", "cinemas", "showtimes", "users"]).isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default DataTable;
