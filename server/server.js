import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { stderr, stdout } from "process";

const app = express();
app.use(cors());

// For ES Modules __dirname trick
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure folders exist
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);


// Storage config for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
const ffmpegPath = `"D:\\_installers\\ffmpeg-2025-10-01-git-1a02412170-full_build\\bin\\ffmpeg.exe"`

// Handle image upload and FFmpeg processing
app.post("/process", upload.single("image"), (req, res) => {
  console.log("HANDLE WORKS");
  const inputPath = path.join(__dirname, "uploads", req.file.filename);
  const outputPath = path.join(__dirname, "output", "processed-" + req.file.filename);

  // CMD //
  const ffmpegCmd = `${ffmpegPath} -y -i "${inputPath}" -vf scale=800:600 "${outputPath}"`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("FFmpeg error:", error);
      return res.status(500).send("Processing failed");
    }
    console.log("FFmpeg output:", stdout || stderr);
    res.json({ message: "Processing complete", file: `processed-${req.file.filename}` });
  });
});

console.log("WORKS");
getAnalytics(stdout, stderr);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/output", express.static(path.join(__dirname, "output")));

app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));



function getAnalytics(stdout, stderr){
  const output = stdout + stderr;

    const durationMatch = output.match(/Duration:\s*(.*?),/);
    const duration = durationMatch ? durationMatch[1] : "Unknown";

    //console.log("✅ Duration:", duration);

    /*
    // Send JSON response with the duration info
    res.json({
      message: "Processing complete",
      file: `processed-${req.file.filename}`,
      duration: duration,
    });
    */
  };
