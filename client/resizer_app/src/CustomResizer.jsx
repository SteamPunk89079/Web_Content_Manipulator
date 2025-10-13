import { useState } from "react";

function CustomResizer() {
  const [file, setFile] = useState(null);

  const [outputUrl, setOutputUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");

  const [originalSize, setOriginalSize] = useState("");
  const [processedSize, setProcessedSize] = useState("");

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  //-------------------------UPLOAD--BUTTON--FUNC------------------------------
  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");
    
    const formData = new FormData();
    formData.append("image", file);
    formData.append("width", width);
    formData.append("height", height);

    const res = await fetch("http://localhost:3001/process", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    setProcessedSize(data.size); 

    const initialUrl = data.file;
    const originalName = initialUrl.replace(/^processed-/, "");

    if (res.ok) {
      setInputUrl(`http://localhost:3001/uploads/${originalName}`);
      setOutputUrl(`http://localhost:3001/output/${data.file}`);
    } else {
      alert("Processing failed!");
    }
  };

  const clearFields = () => {
    setWidth(""); setHeight("");
  };
  //-------------------------UPLOAD--BUTTON--FUNCT------------------------------
  //-------------------------ASSETS----------------------------------
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setOriginalSize(`${naturalWidth} × ${naturalHeight}px`);
  };
  
  const handleProcessedImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (!processedSize) { 
      setProcessedSize(`${naturalWidth} × ${naturalHeight}px`);
    }
  };

  const setWidthButtonFunct = (e) => {
    setWidth(e.target.value);
  }
  const setHeightButtonFunct = (e) => {
    setHeight(e.target.value);
  }
  //-------------------------ASSETS----------------------------------


  //-------------------------RENDER----------------------------------
  return (
    <div className="app_card" >
      <h1 style={{ fontWeight: "bold" }}>Custom resizer</h1>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={() => {handleUpload();clearFields();}} role="button">Upload</button>
      
      <div>
        <input className="resize_fields" id="width" type="number" min="1" placeholder="Width" value={width} onChange={setWidthButtonFunct} />
        <input className="resize_fields" id="height" type="number" min="1" placeholder="Height" value={height} onChange={setHeightButtonFunct}/>
      </div>
      
      <div style={{ display: "flex", gap: "10%", alignItems: "flex-start", justifyContent:"center"}}>
        {inputUrl && (
          <div>
            <h2>Initial Image:</h2>
            <img src={inputUrl} alt="Original" width="400" onLoad={handleImageLoad} />
            <h4>Original size: {originalSize || "Loading..."}</h4>
          </div>
        )}

        {outputUrl && (
          <div>
            <h2>Processed Image:</h2>
            <img src={outputUrl} alt="Processed" width="400" onLoad={handleProcessedImageLoad} style={{border: "4px solid gold"}}s/>
            <h4>Processed size: {processedSize || "Loading..."}</h4>
          </div>
        )}
      </div>

    </div>
  );
  //-------------------------RENDER----------------------------------

  
}

export default CustomResizer;
