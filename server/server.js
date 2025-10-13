import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import os from "os";

//----------express-server-------
const app = express();
app.use(cors());
//-------------------------------

//-----------------------ES-MODULES-PARSE-----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//--------------------------------------------------------------

//-----------------------Ensure folders exist-------------------
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
//--------------------------------------------------------------

//-----------------------MULTER CONFIG--------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
//--------------------------------------------------------------

//-----------------------OS-DETECTION---------------------------
const platform = os.platform(); // win32 , darwin=macos, linux
let ffmpegPath = "ffmpeg";
let ffprobePath = "ffprobe";

if (platform === "win32") {
  console.log("Running on Windows");
  ffmpegPath = `"D:\\_installers\\ffmpeg-2025-10-01-git-1a02412170-full_build\\bin\\ffmpeg.exe"`;
  ffprobePath = ffmpegPath.replace("ffmpeg.exe", "ffprobe.exe");
}else{
  console.log("Running on Mac OS");
}
//-----------------------OS-DETECTION---------------------------

//-----------------------ROUTE: PROCESS-------------------------
app.post("/process", upload.single("image"), (req, res) => {
  console.log("HANDLE WORKS");

  const inputPath = path.join(uploadDir, req.file.filename);
  const outputPath = path.join(outputDir, "processed-" + req.file.filename);

  const width = req.body.width || 800;
  const height = req.body.height || 600;

  console.log(`Scaling image to: ${width}x${height}`);

  const ffmpegCmd = `${ffmpegPath} -y -i "${inputPath}" -vf scale=800:600 "${outputPath}"`;

  exec(ffmpegCmd, (error, stdout, stderr) => {
    if (error) {
      console.error("FFmpeg error:", error);
      return res.status(500).send("Processing failed");
    }

    const ffprobeCmd = `${ffprobePath} -v error -show_entries stream=width,height -of csv=p=0:s=x "${outputPath}"`;

    exec(ffprobeCmd, (probeError, probeStdout) => {
      if (probeError) {
        console.error("FFprobe error:", probeError);
        return res.status(500).send("Failed to get output size");
      }

      const outputSize = probeStdout.trim(); // e.g. "800x600"
      console.log(`✅ Processed ${req.file.filename} → ${outputSize}`);

      res.json({
        message: "Processing complete",
        file: `processed-${req.file.filename}`,
        size: outputSize,
      });
    });
  });
});
//--------------------------------------------------------------

//-----------------------STATIC FILES----------------------------
app.use("/uploads", express.static(uploadDir));
app.use("/output", express.static(outputDir));
//--------------------------------------------------------------

app.listen(3001, () =>
  console.log("✅ Server running on http://localhost:3001")
);
