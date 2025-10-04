import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [outputUrl, setOutputUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3001/process", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setOutputUrl(`http://localhost:3001/output/${data.file}`);
    } else {
      alert("Processing failed!");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>FFmpeg Image Processor</h1>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Process</button>

      {outputUrl && (
        <div>
          <h2>Processed Image:</h2>
          <img src={outputUrl} alt="Processed" width="400" />
        </div>
      )}
    </div>
  );
}

export default App;
