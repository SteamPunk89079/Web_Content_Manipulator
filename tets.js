import { exec } from "child_process";
import path from "path";
import fs from "fs";
import express from "express";
import multer from "multer";

const app = express();
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 👇 Use your full path to ffmpeg.exe
const ffmpegPath = `"D:\\_installers\\ffmpeg-2025-10-01-git-1a02412170-full_build\\bin\\ffmpeg.exe"`;

app.post("/process", upload.single("image"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join(outputDir, "processed-" + req.file.filename);
  const ffmpegCmd = `${ffmpegPath} -y -i "${inputPath}" -vf scale=800:600 "${outputPath}"`;

  console.log("Running:", ffmpegCmd);

  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ FFmpeg error:", error);
      return res.status(500).json({ message: "Processing failed", error: error.message });
    }

    console.log("✅ FFmpeg output:", stdout || stderr);
    res.json({
      message: "Processing complete",
      file: `processed-${req.file.filename}`,
      path: outputPath,
    });
  });
});

app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));
