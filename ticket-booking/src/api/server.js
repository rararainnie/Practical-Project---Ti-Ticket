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

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
