import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey";

// MOCK DATABASE
let users = [];
let jobs = [];

// instal prisma npm install prisma @prisma/client | npx prisma init
// instal npm install jsonwebtoken bcryptjs
// instal npm install express cors
// run server npm run dev

/* =========================
   REGISTER
========================= */
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    email,
    password: hashed
  };

  users.push(user);

  res.json({ message: "User created" });
});

/* =========================
   LOGIN
========================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });

  res.json({ token });
});

/* =========================
   AUTH MIDDLEWARE
========================= */
function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* =========================
   PROTECTED ROUTE
========================= */
app.get("/me", auth, (req, res) => {
  res.json({ message: "You are logged in", user: req.user });
});

app.listen(5000, () => {
  console.log("Auth server running 🔐");
});

/* MY APPLICATIONS */
app.get("/my-applications", auth, async (req, res) => {
  const apps = await prisma.application.findMany({
    where: { userId: req.user.id },
    include: { job: true }
  });

  res.json(apps);
});

/* MY JOBS (COMPANY) */
app.get("/my-jobs", auth, async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { companyId: req.user.id }
  });

  res.json(jobs);
});

