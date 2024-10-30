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

// สร้าง API เพื่อดึงข้อมูลหนังทั้งหมดจาก stored procedure
app.get("/movies", (req, res) => {
  const query = "CALL GetAllMovies()";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results[0]);
  });
});

// API เพื่อดึงข้อมูล CinemaLocation
app.get("/cinemalocation", (req, res) => {
  const query = "CALL GetCinemaLocation()";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results[0]);
  });
});

// API เพื่อดึงข้อมูล Zone
app.get("/zone", (req, res) => {
  const query = "CALL GetZone()";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data");
      return;
    }
    res.json(results[0]);
  });
});

// API เพื่อดึงหนังทุกเรื่องตาม CinemaLocation
app.get("/cinema/:CinemaLocationCode/movies", (req, res) => {
  const locationId = req.params.CinemaLocationCode;
  const query = "CALL GetMoviesByCinemaLocation(?)";
  db.query(query, [locationId], (err, results) => {
    if (err) {
      console.error("Error fetching movies:", err);
      res.status(500).send("Error fetching movies");
    } else {
      res.json(results[0]);
    }
  });
});

// API เพื่อดึงข้อมูลโรงภาพยนตร์จาก MovieID
app.get("/movie/:MovieID/cinemas", (req, res) => {
  const movieId = req.params.MovieID;
  const query = "CALL GetCinemasByMovieID(?)";
  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error("Error fetching cinemas:", err);
      res.status(500).send("Error fetching cinemas");
    } else {
      res.json(results[0]);
    }
  });
});

// API เพื่อดึงข้อมูล CinemaNo และ ShowTime โดยใช้ MovieID และ CinemaLocationCode
app.get("/movie/:MovieID/cinema/:CinemaLocationCode", (req, res) => {
  const movieId = req.params.MovieID;
  const cinemaLocationCode = req.params.CinemaLocationCode;
  const query = "CALL GetShowTimeAndCinema(?, ?)";
  db.query(query, [movieId, cinemaLocationCode], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโรงภาพยนตร์และรอบฉาย:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลโรงภาพยนตร์และรอบฉาย");
    } else {
      res.json(results[0]);
    }
  });
});

// API เพื่อดึงข้อมูล Seat ที่เกี่ยวข้องกับ TimeCode
app.get("/showtime/:TimeCode/seats", (req, res) => {
  const timeCode = req.params.TimeCode;
  const query = "CALL GetSeatsByTimeCode(?)";
  db.query(query, [timeCode], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง");
    } else {
      res.json(results[0]);
    }
  });
});

// เพิ่ม middleware เพื่อ parse JSON body
app.use(express.json());

// API เพื่ออัปเดต Status ของที่นั่ง
app.put("/seat/:SeatCode/status", (req, res) => {
  const seatCode = req.params.SeatCode;
  const { Status, UserID } = req.body;

  if (!Status || !UserID) {
    return res.status(400).send("Status and UserID are required");
  }

  const query = "CALL UpdateSeatStatus(?, ?, ?)";
  db.query(query, [seatCode, Status, UserID], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะที่นั่ง:", err);
      return res.status(500).send("เกิดข้อผิดพลาดในการอัปเดตสถานะที่นั่ง");
    }

    const updatedRows = result[0][0].updated_rows;
    if (updatedRows === 0) {
      return res.status(400).send("ไม่สามารถอัพเดทที่นั่งได้ (อาจถูกจองไปแล้ว)");
    }
    
    res.status(200).send("อัปเดตสถานะที่นั่งและ UserID เรียบร้อยแล้ว");
  });
});

// API สำหรับการเข้าสู่ระบบ
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = "CALL UserLogin(?, ?)";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการเข้าสู่ระบบ:', err);
      res.status(500).send('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } else {
      if (results[0].length > 0) {
        res.json(results[0][0]);
      } else {
        res.status(401).send('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    }
  });
});

// API เพื่อดึงข้อมูลการจองของผู้ใช้
app.get("/user/:UserID/bookings", (req, res) => {
  const userId = req.params.UserID;
  const query = "CALL GetUserBookings(?)";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง");
    } else {
      res.json(results[0]);
    }
  });
});

// API สำหรับการลงทะเบียนผู้ใช้ใหม่
app.post('/register', (req, res) => {
  const { Email, Password, FName, LName } = req.body;

  if (!Email || !Password || !FName || !LName) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  const query = "CALL RegisterUser(?, ?, ?, ?)";
  db.query(query, [Email, Password, FName, LName], (err) => {
    if (err) {
      if (err.sqlMessage === 'Email already exists') {
        return res.status(409).send('อีเมลนี้ถูกใช้งานแล้ว');
      }
      console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', err);
      return res.status(500).send('เกิดข้อผิดพลาดในการลงทะเบียน');
    }

    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
  });
});

// API สำหรับการรีเซ็ตรหัสผ่าน
app.put('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send('กรุณากรอกอีเมลและรหัสผ่านใหม่');
  }

  const query = "CALL ResetPassword(?, ?)";
  db.query(query, [email, newPassword], (err, result) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', err);
      return res.status(500).send('เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('ไม่พบอีเมลในระบบ');
    }

    res.status(200).json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
