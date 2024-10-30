import PropTypes from 'prop-types';
import { useState } from 'react';

function DataTable({ data, type, onRefresh }) {
  const [editingId, setEditingId] = useState(null);

  const getHeaders = () => {
    switch (type) {
      case 'movies':
        return ['ID', 'ชื่อเรื่อง', 'ประเภท', 'เรทติ้ง', 'ระยะเวลา', 'วันที่ฉาย', 'การจัดการ'];
      case 'cinemas':
        return ['รหัส', 'ชื่อโรงภาพยนตร์', 'โซน', 'การจัดการ'];
      case 'showtimes':
        return ['รหัส', 'ภาพยนตร์', 'โรงภาพยนตร์', 'วันและเวลา', 'การจัดการ'];
      case 'users':
        return ['ID', 'อีเมล', 'ชื่อ', 'นามสกุล', 'สถานะ', 'การจัดการ'];
      default:
        return [];
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
      try {
        const response = await fetch(`http://localhost:3001/admin/${type}/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          onRefresh();
        } else {
          alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    }
  };

  const renderRow = (item) => {
    switch (type) {
      case 'movies':
        return (
          <tr key={item.MovieID} className="border-b border-gray-700">
            <td className="px-4 py-2 text-white">{item.MovieID}</td>
            <td className="px-4 py-2 text-white">{item.Title}</td>
            <td className="px-4 py-2 text-white">{item.Genre}</td>
            <td className="px-4 py-2 text-white">{item.Rating}</td>
            <td className="px-4 py-2 text-white">{item.Duration} นาที</td>
            <td className="px-4 py-2 text-white">
              {new Date(item.ReleaseDate).toLocaleDateString('th-TH')}
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
      case 'cinemas':
        return (
          <tr key={item.CinemaLocationCode} className="border-b border-gray-700">
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
      case 'showtimes':
        return (
          <tr key={item.TimeCode} className="border-b border-gray-700">
            <td className="px-4 py-2 text-white">{item.TimeCode}</td>
            <td className="px-4 py-2 text-white">{item.MovieTitle}</td>
            <td className="px-4 py-2 text-white">{item.CinemaName}</td>
            <td className="px-4 py-2 text-white">
              {new Date(item.ShowDateTime).toLocaleString('th-TH')}
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
      case 'users':
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

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setEditingId('new')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          เพิ่มข้อมูลใหม่
        </button>
      </div>

      <div className="overflow-x-auto">
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
          <tbody>
            {data.map(renderRow)}
          </tbody>
        </table>
      </div>

      {/* TODO: Add EditModal component for editing data */}
      {editingId && (
        <div>
          {/* Add your edit modal/form component here */}
        </div>
      )}
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['movies', 'cinemas', 'showtimes', 'users']).isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default DataTable;
