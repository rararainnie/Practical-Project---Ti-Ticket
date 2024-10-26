import express from "express";
import { createConnection } from "mysql2";
import cors from "cors";

const app = express();
const port = 3001;

// เปิดใช้งาน CORS เพื่ออนุญาตการเชื่อมต่อจาก frontend (Vite)
app.use(cors());

// สร้างการเชื่อมต่อกับฐานข้อมูล MySQL
const db = createConnection({
  host: "localhost", // หรือ IP ของฐานข้อมูล MySQL
  user: "root", // ชื่อผู้ใช้งาน MySQL
  password: "pun1234", // รหัสผ่าน MySQL (ให้ใส่รหัสของคุณ)
  database: "movies_ticket_schema", // ชื่อฐานข้อมูล
});

// ตรวจสอบการเชื่อมต่อ
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// สร้าง API เพื่อดึงข้อมูลหนังทั้งหมดจากตาราง Movies
app.get("/movies", (req, res) => {
  const query = "SELECT * FROM Movies";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

// API เพื่อดึงข้อมูล CinemaLocation
app.get("/cinemalocation", (req, res) => {
  const query = "SELECT * FROM CinemaLocation";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

// API เพื่อดึงข้อมูล Zone
app.get("/zone", (req, res) => {
  const query = "SELECT * FROM Zone";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results);
  });
});

// API เพื่อดึงหนังทุกเรื่องตาม CinemaLocation
app.get('/cinema/:CinemaLocationCode/movies', (req, res) => {
  const locationId = req.params.CinemaLocationCode; // แก้ไขจาก locationId เป็น CinemaLocationCode
  
  const query = `
    SELECT m.* 
    FROM CinemaLocation_has_Movies clm
    JOIN Movies m ON clm.Movies_MovieID = m.MovieID
    WHERE clm.CinemaLocation_CinemaLocationCode = ?
  `;

  db.query(query, [locationId], (err, results) => {
    if (err) {
      console.error('Error fetching movies:', err);
      res.status(500).send('Error fetching movies');
    } else {
      res.json(results);
    }
  });
});

// API เพื่อดึงข้อมูลโรงภาพยนตร์จาก MovieID
app.get('/movie/:MovieID/cinemas', (req, res) => {
  const movieId = req.params.MovieID; // แก้ไขจาก movieID เป็น MovieID
  
  const query = `
    SELECT cl.*
    FROM CinemaLocation_has_Movies clm
    JOIN CinemaLocation cl ON clm.CinemaLocation_CinemaLocationCode = cl.CinemaLocationCode
    WHERE clm.Movies_MovieID = ?
  `;

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error('Error fetching cinemas:', err);
      res.status(500).send('Error fetching cinemas');
    } else {
      res.json(results);
    }
  });
});

// API เพื่อดึงข้อมูล CinemaNo และ ShowTime โดยใช้ MovieID และ CinemaLocationCode
app.get('/movie/:MovieID/cinema/:CinemaLocationCode', (req, res) => {
  const movieId = req.params.MovieID;
  const cinemaLocationCode = req.params.CinemaLocationCode;
  
  const query = `
    SELECT 
        st.TimeCode,
        st.ShowDateTime,
        st.CinemaNo_CinemaNoCode AS CinemaNo,
        cn.Name AS CinemaNoName,
        cl.Name AS CinemaLocationName,
        cl.CinemaLocationCode AS CinemaLocationId
    FROM 
        ShowTime st
    JOIN 
        CinemaNo cn ON st.CinemaNo_CinemaNoCode = cn.CinemaNoCode
    JOIN 
        CinemaLocation cl ON cn.CinemaLocation_CinemaLocationCode = cl.CinemaLocationCode
    WHERE 
        st.Movies_MovieID = ? 
        AND cl.CinemaLocationCode = ?
    ORDER BY 
        cl.Name
  `;

  db.query(query, [movieId, cinemaLocationCode], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโรงภาพยนตร์และรอบฉาย:', err);
      res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลโรงภาพยนตร์และรอบฉาย');
    } else {
      res.json(results);
    }
  });
});

// API เพื่อดึงข้อมูล Seat ที่เกี่ยวข้องกับ TimeCode
app.get('/showtime/:TimeCode/seats', (req, res) => {
  const timeCode = req.params.TimeCode;
  
  const query = `
    SELECT 
        s.*
    FROM 
        Seats s
    JOIN 
        ShowTime st ON s.ShowTime_TimeCode = st.TimeCode
    WHERE 
        s.ShowTime_TimeCode = ?
    ORDER BY 
        s.SeatName
  `;

  db.query(query, [timeCode], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง:', err);
      res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง');
    } else {
      res.json(results);
    }
  });
});

// เพิ่ม middleware เพื่อ parse JSON body
app.use(express.json());

// API เพื่ออัปเดต Status ของที่นั่ง
app.put('/seat/:SeatCode/status', (req, res) => {
  const seatCode = req.params.SeatCode;
  const { Status } = req.body;
  
  if (!Status) {
    return res.status(400).send('Status is required');
  }

  const query = `
    UPDATE Seats
    SET Status = ?
    WHERE SeatCode = ?
  `;

  db.query(query, [Status, seatCode], (err, result) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะที่นั่ง:', err);
      res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตสถานะที่นั่ง');
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send('ไม่พบที่นั่งที่ระบุ');
      } else {
        res.status(200).send('อัปเดตสถานะที่นั่งเรียบร้อยแล้ว');
      }
    }
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
