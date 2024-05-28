import express from "express";
import KnexJS from "knex";
import jwt from "jsonwebtoken";
import cors from "cors";

// Inisialisasi koneksi Knex.js
const knex = KnexJS({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "r00t_d3v3L0pm3nt",
    database: "esri_test",
  },
});

const app = express();

app.use(express.json());
app.use(cors());

// Secret key untuk JWT
const JWT_SECRET_KEY = "secret_key";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ message: "Token tidak tersedia" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "Format token tidak valid" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token tidak tersedia" });
  }
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token tidak valid" });
    req.userId = decoded.id;
    next();
  });
};

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await knex("users").where({ username, password }).first();
    if (user) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
        expiresIn: "1h", // Token berlaku selama 1 jam
      });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: "Autentikasi gagal" });
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "internal server error" });
  }
});

app.post("/api/points", verifyToken, async (req, res) => {
  const { x, y, ratio, orientation } = req.body;
  try {
    await knex("points").insert({
      x,
      y,
      ratio,
      orientation,
      user_id: req.userId,
    });
    return res.status(201).json({ message: "Point berhasil ditambahkan" });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "internal server error" });
  }
});

app.get("/api/points", verifyToken, async (req, res) => {
  try {
    const points = await knex("points").select("*");
    // .where({ user_id: req.userId });
    return res.json({ points });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "internal server error" });
  }
});

// Mulai server
app.listen(8080, () => {
  console.log("Server berjalan di http://localhost:8080");
});
