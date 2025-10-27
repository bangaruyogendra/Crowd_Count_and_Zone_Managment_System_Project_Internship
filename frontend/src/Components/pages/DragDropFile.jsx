import { useRef, useState } from "react";
import axios from 'axios';
export default function DragDropFile() {
  const uploadRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [url, setUrl] = useState(null);
  const [peopleCount, setPeopleCount] = useState(null);
  
  const handleChange = (e) => {
    const selectedFile = uploadRef.current.files[0];
    if (selectedFile) {
      console.log(selectedFile);
      setFile(selectedFile);
      setUrl(URL.createObjectURL(selectedFile));
      uploadFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      console.log(droppedFile);
      setFile(droppedFile);
      setUrl(URL.createObjectURL(droppedFile));
      uploadFile(droppedFile);
    }
    setIsDragOver(false);
  };

  const uploadFile = async(selectedFile)=>{
       const formData = new FormData()
       formData.append("image",selectedFile);

       try{
            const response = await axios.post("http://127.0.0.1:8000/detect/",formData,{
              responseType:"blob"
            });
            console.log(response)
            const imageBlob = response.data;
            console.log("image:",imageBlob);

            const imageUrl = URL.createObjectURL(imageBlob);
            console.log(imageUrl);
            setUrl(imageUrl);
            
            const peopleCount = response.headers['peoplecount'];

            console.log("People Count:", peopleCount);
            setPeopleCount(peopleCount)
       }
       catch (error) {
          console.error("Upload failed:", error);
       }
  }

  return (
    <div
      style={{
        background: "rgba(219,219,219,1)",
        width: "100%",
        minHeight: "40vh",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        opacity: isDragOver ? 0.5 : 1,
      }}
      onClick={() => uploadRef.current.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setIsDragOver(false)}
    >
      <input
        ref={uploadRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <h2 style={{ color: "black" }}>Upload</h2>
      <p style={{ color: "black" }}>{file && file.name}</p>

      {file && (
        <img
          src={url}
          alt={file.name || ""}
          style={{width:'30%',minHeight:'20vh', borderRadius: "10px", display:"flex",position:'relative' }}
        />
        )}

       {peopleCount !== null && (
            <p style={{ color: "black", marginTop: "10px" }}>
                People detected:{peopleCount}
            </p>
       )}
       
    </div>
  );
}
