import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import url from "url";

const PORT = 8800 || process.env.PORT;
const app = express();
dotenv.config();
const connect = () => {
  //   mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err, "DS");
    });
};

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
// app.use(cors());

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/comment", commentRoutes);
// app.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || "something went wrong!";
//   next();
//   return res.status(status).json({
//     success: status,
//     status: status,
//     message: message,
//   });
// });

export function currDir(fileUrl) {
  const __filename = url.fileURLToPath(fileUrl);
  return path.dirname(__filename);
}
const __dirname = currDir(import.meta.url);
console.log(__dirname);

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  connect();
  console.log(`running sever at ${PORT}`);
});
