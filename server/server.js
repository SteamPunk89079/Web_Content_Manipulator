import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

// For ES Modules __dirname trick
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Handle image upload and FFmpeg processing
app.post("/process", upload.single("image"), (req, res) => {
  const inputPath = path.join(__dirname, "uploads", req.file.filename);
  const outputPath = path.join(__dirname, "output", "processed-" + req.file.filename);

  // Example: resize to 800x600
  const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf scale=800:600 "${outputPath}"`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("FFmpeg error:", error);
      return res.status(500).send("Processing failed");
    }
    console.log("FFmpeg output:", stdout || stderr);
    res.json({ message: "Processing complete", file: `processed-${req.file.filename}` });
  });
});

app.use("/output", express.static(path.join(__dirname, "output"))); // to serve processed files

app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));
