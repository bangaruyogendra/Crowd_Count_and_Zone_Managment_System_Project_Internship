import React, { useEffect, useRef, useState, useContext } from "react";
import Webcam from "react-webcam";
import videoContext from "./videoContext";
import "./VideoZones.css";
import Dashboard from './Dashboard';

const VideoZones = () => {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [move,setMove] = useState(false);
  
  const { peopleCount,setPeopleCount,framesProcessed, setFramesProcessed } = useContext(videoContext);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/video/");
    ws.onopen = () => console.log("Connected to backend");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.detections) {
        setPeopleCount(data.people_count);
        setDetections(data.detections);
        setFramesProcessed((prev) => prev + 1);
      }
    };

    ws.onclose = () => console.log("WebSocket closed");
    setSocket(ws);
    return () => ws.close();
  }, [setPeopleCount, setFramesProcessed]);

  useEffect(() => {
    let timer;
    if (isRunning && socket && webcamRef.current) {
      timer = setInterval(() => {
        const imgSrc = webcamRef.current.getScreenshot();
        if (imgSrc) {
          socket.send(JSON.stringify({ frame: imgSrc }));
        }
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isRunning, socket]);

  useEffect(() => {

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox.map((n) => parseFloat(n));
      const width = x2 - x1;
      const height = y2 - y1;
      const score = (det.confidence * 100).toFixed(1);
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, width, height);
      ctx.font = "14px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(`Person ${score}%`, x1 + 5, y1 - 5);
    });
  }, [detections]);

  // if (setIsRunning(false)){
  //    <Dashboard/>
  // }

  

  return (
    <div className="Main">
      <h1>People Detection</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        <Webcam
          ref={webcamRef}
          width={640}
          height={480}
          screenshotFormat="image/jpeg"
          mirrored
          style={{ borderRadius: "8px" }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: "absolute", top: 0, left: 0, borderRadius: "8px" }}
        />
      </div>

       <div className="results">
        People detected: <strong>{peopleCount}</strong>
      </div>

      <div className="buttons">

        <button onClick={() => 
          setIsRunning(true)
          }>Start Detection</button>

        <button onClick={() => {
            setIsRunning(false);
            setMove(true);
          }}>Stop</button>

      </div>
    </div>
  );
};

export default VideoZones;
