import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import DataTable from "../components/dataTable";

function AdminPage() {
  const [activeTab, setActiveTab] = useState("movies");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/admin/${tab}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-yellow-500 mb-8">จัดการระบบ</h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("movies")}
            className={`px-4 py-2 rounded ${
              activeTab === "movies"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 text-yellow-500"
            }`}
          >
            ภาพยนตร์
          </button>
          <button
            onClick={() => setActiveTab("cinemas")}
            className={`px-4 py-2 rounded ${
              activeTab === "cinemas"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 text-yellow-500"
            }`}
          >
            โรงภาพยนตร์
          </button>
          <button
            onClick={() => setActiveTab("showtimes")}
            className={`px-4 py-2 rounded ${
              activeTab === "showtimes"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 text-yellow-500"
            }`}
          >
            รอบฉาย
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded ${
              activeTab === "users"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 text-yellow-500"
            }`}
          >
            ผู้ใช้งาน
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-gray-800 rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <DataTable
              data={data}
              type={activeTab}
              onRefresh={() => fetchData(activeTab)}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;
