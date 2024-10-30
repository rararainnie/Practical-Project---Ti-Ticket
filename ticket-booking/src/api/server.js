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
  password: "rainnie", // รหัสผ่าน MySQL (ให้ใส่รหัสของคุณ)
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
app.get("/cinema/:CinemaLocationCode/movies", (req, res) => {
  const locationId = req.params.CinemaLocationCode;

  const query = `
    SELECT m.* 
    FROM CinemaLocation_has_Movies clm
    JOIN Movies m ON clm.Movies_MovieID = m.MovieID
    WHERE clm.CinemaLocation_CinemaLocationCode = ?
  `;

  db.query(query, [locationId], (err, results) => {
    if (err) {
      console.error("Error fetching movies:", err);
      res.status(500).send("Error fetching movies");
    } else {
      res.json(results);
    }
  });
});

// API เพื่อดึงข้อมูลโรงภาพยนตร์จาก MovieID
app.get("/movie/:MovieID/cinemas", (req, res) => {
  const movieId = req.params.MovieID; // แก้ไขจาก movieID เป็น MovieID

  const query = `
    SELECT cl.*
    FROM CinemaLocation_has_Movies clm
    JOIN CinemaLocation cl ON clm.CinemaLocation_CinemaLocationCode = cl.CinemaLocationCode
    WHERE clm.Movies_MovieID = ?
  `;

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error("Error fetching cinemas:", err);
      res.status(500).send("Error fetching cinemas");
    } else {
      res.json(results);
    }
  });
});

// API เพื่อดึงข้อมูล CinemaNo และ ShowTime โดยใช้ MovieID และ CinemaLocationCode
app.get("/movie/:MovieID/cinema/:CinemaLocationCode", (req, res) => {
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
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโรงภาพยนตร์และรอบฉาย:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลโรงภาพยนตร์และรอบฉาย");
    } else {
      res.json(results);
    }
  });
});

// API เพื่อดึงข้อมูล Seat ที่เกี่ยวข้องกับ TimeCode
app.get("/showtime/:TimeCode/seats", (req, res) => {
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
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลที่นั่ง");
    } else {
      res.json(results);
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

  const query = `
    UPDATE Seats
    SET Status = ?, User_UserID = ?
    WHERE SeatCode = ?
  `;

  db.query(query, [Status, UserID, seatCode], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะที่นั่ง:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการอัปเดตสถานะที่นั่ง");
    } else {
      if (result.affectedRows === 0) {
        res.status(404).send("ไม่พบที่นั่งที่ระบุ");
      } else {
        res.status(200).send("อัปเดตสถานะที่นั่งและ UserID เรียบร้อยแล้ว");
      }
    }
  });
});

// เพิ่ม API สำหรับการเข้าสู่ระบบ
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT UserID, FName, LName, Status
    FROM User
    WHERE Email = ? AND Password = ?
  `;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(401).send("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    }
  });
});

// API เพื่อดึงข้อมู���การจองของผู้ใช้
app.get("/user/:UserID/bookings", (req, res) => {
  const userId = req.params.UserID;

  const query = `
    SELECT 
      m.Title AS MovieTitle,
      m.Image AS MovieImage,
      st.ShowDateTime,
      st.TimeCode AS ShowTimeCode,
      cl.Name AS CinemaLocationName,
      cn.Name AS CinemaNoName,
      GROUP_CONCAT(s.SeatName ORDER BY s.SeatName ASC SEPARATOR ', ') AS SeatNames,
      SUM(s.Price) AS TotalPrice
    FROM 
      Seats s
      JOIN ShowTime st ON s.ShowTime_TimeCode = st.TimeCode
      JOIN Movies m ON st.Movies_MovieID = m.MovieID
      JOIN CinemaNo cn ON st.CinemaNo_CinemaNoCode = cn.CinemaNoCode
      JOIN CinemaLocation cl ON cn.CinemaLocation_CinemaLocationCode = cl.CinemaLocationCode
    WHERE 
      s.User_UserId = ?
    GROUP BY 
      st.TimeCode
    ORDER BY 
      st.ShowDateTime DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง");
    } else {
      res.json(results);
    }
  });
});

// API สำหรับการลงทะเบียนผู้ใช้ใหม่
app.post("/register", (req, res) => {
  const { Email, Password, FName, LName } = req.body;

  // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!Email || !Password || !FName || !LName) {
    return res.status(400).send("กรุณากรอกข้อมูลให้ครบถ้วน");
  }

  // ตรวจสอบว่าอีเมลซ้ำหรือไม่
  const checkEmailQuery = "SELECT * FROM User WHERE Email = ?";
  db.query(checkEmailQuery, [Email], (err, results) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมล:", err);
      return res.status(500).send("เกิดข้อผิดพลาดในการลงทะเบียน");
    }

    if (results.length > 0) {
      return res.status(409).send("อีเมลนี้ถูกใช้งานแล้ว");
    }

    // เพิ่มผู้ใช้ใหม่ลงในฐานข้อมูล
    const insertQuery =
      'INSERT INTO User (Email, Password, FName, LName, Status) VALUES (?, ?, ?, ?, "User")';
    db.query(insertQuery, [Email, Password, FName, LName], (err, result) => {
      if (err) {
        console.error("เกิดข้อผิดพลาดในการลงทะเบียน:", err);
        return res.status(500).send("เกิดข้อผิดพลาดในการลงทะเบียน");
      }

      res
        .status(201)
        .json({ message: "ลงทะเบียนสำเร็จ", userId: result.insertId });
    });
  });
});

// API สำหรับการรีเซ็ตรหัสผ่าน
app.put("/reset-password", (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send("กรุณากรอกอีเมลและรหัสผ่านใหม่");
  }

  const query = `
    UPDATE User
    SET Password = ?
    WHERE Email = ?
  `;

  db.query(query, [newPassword, email], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:", err);
      return res.status(500).send("เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("ไม่พบอีเมลในระบบ");
    }

    res.status(200).json({ message: "รีเซ็ตรหัสผ่านสำเร็จ" });
  });
});

// Admin API Endpoints

// ดึงข้อมูลทั้งหมดสำหรับ admin
app.get("/admin/:type", (req, res) => {
  const type = req.params.type;
  let query = "";

  switch (type) {
    case "movies":
      query = "SELECT * FROM Movies";
      break;
    case "cinemas":
      query = `
        SELECT cl.*, z.Name as ZoneName 
        FROM CinemaLocation cl 
        JOIN Zone z ON cl.Zone_ZoneID = z.ZoneID
      `;
      break;
    case "showtimes":
      query = `
        SELECT st.*, m.Title as MovieTitle, cn.Name as CinemaName 
        FROM ShowTime st
        JOIN Movies m ON st.Movies_MovieID = m.MovieID
        JOIN CinemaNo cn ON st.CinemaNo_CinemaNoCode = cn.CinemaNoCode
      `;
      break;
    case "users":
      query = "SELECT UserID, Email, FName, LName, Status FROM User";
      break;
    default:
      return res.status(400).send("Invalid type");
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error(`Error fetching ${type}:`, err);
      res.status(500).send(`Error fetching ${type}`);
    } else {
      res.json(results);
    }
  });
});

// เพิ่มข้อมูลใหม่
app.post("/admin/:type", (req, res) => {
  const type = req.params.type;
  const data = req.body;

  let query = "";
  let values = [];

  switch (type) {
    case "movies":
      query =
        "INSERT INTO Movies (Title, Description, Image, Genre, Rating, Duration, ReleaseDate) VALUES (?, ?, ?, ?, ?, ?, ?)";
      values = [
        data.Title,
        data.Description,
        data.Image,
        data.Genre,
        data.Rating,
        data.Duration,
        data.ReleaseDate,
      ];
      break;
    // เพิ่ม cases อื่นๆ ตามความต้องการ
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(`Error adding ${type}:`, err);
      res.status(500).send(`Error adding ${type}`);
    } else {
      res.status(201).json({ id: result.insertId });
    }
  });
});

// อัพเดทข้อมูล
app.put("/admin/:type/:id", (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const data = req.body;

  let query = "";
  let values = [];

  switch (type) {
    case "movies":
      query =
        "UPDATE Movies SET Title = ?, Description = ?, Genre = ?, Rating = ?, Duration = ?, ReleaseDate = ? WHERE MovieID = ?";
      values = [
        data.Title,
        data.Description,
        data.Genre,
        data.Rating,
        data.Duration,
        data.ReleaseDate,
        id,
      ];
      break;
    // เพิ่ม cases อื่นๆ ตามความต้องการ
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(`Error updating ${type}:`, err);
      res.status(500).send(`Error updating ${type}`);
    } else {
      res.json({ message: "Updated successfully" });
    }
  });
});

// ลบข้อมูล
app.delete("/admin/:type/:id", (req, res) => {
  const type = req.params.type;
  const id = req.params.id;

  let query = "";
  switch (type) {
    case "movies":
      query = "DELETE FROM Movies WHERE MovieID = ?";
      break;

    case "users":
      query = "DELETE FROM User WHERE UserID = ?";
      break;

    case "showtimes":
      query = "DELETE FROM ShowTime WHERE TimeCode = ?";
      break;
  }

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(`Error deleting ${type}:`, err);
      res.status(500).send(`Error deleting ${type}`);
    } else {
      res.json({ message: "Deleted successfully" });
    }
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
