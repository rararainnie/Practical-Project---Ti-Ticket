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
  const locationId = req.params.locationId;
  
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
app.get('/movie/:MovieId/cinemas', (req, res) => {
  const movieId = req.params.movieId;
  
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
app.get('/movie/:Movies_MovieID/cinema/:CinemaLocationCode', (req, res) => {
  const movieId = req.params.movieId;
  const cinemaLocationCode = req.params.cinemaLocationCode;
  
  const query = `
    SELECT 
        st.CinemaNo,
        st.ShowDateTime,
        cl.Name AS CinemaLocationName,
        cl.Address AS CinemaLocationAddress
    FROM 
        ShowTime st
    JOIN 
        CinemaLocation cl 
        ON st.CinemaLocation_CinemaLocationCode = cl.CinemaLocationCode
    WHERE 
        st.Movies_MovieID = ? 
        AND st.CinemaLocation_CinemaLocationCode = ?
  `;

  db.query(query, [movieId, cinemaLocationCode], (err, results) => {
    if (err) {
      console.error('Error fetching cinema and showtime:', err);
      res.status(500).send('Error fetching cinema and showtime');
    } else {
      res.json(results);
    }
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
