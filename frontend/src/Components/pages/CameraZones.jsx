import React, { useState } from 'react';
import axios from 'axios';
import './CameraZones.css';
import DragDropFile from './DragDropFile';
import Dashboard from './Dashboard';
import videoContext from './videoContext';

const CameraZones = () => {
  const [mode, setMode] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [peopleCount, setPeopleCount] = useState(null);
  const [framesProcessed, setFramesProcessed] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a video first!');
      return;
    }

    const formData = new FormData();
    formData.append('video_file', selectedFile);

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      //backend returns JSON like:
      // { total_people: 12, frames_processed: 240 }
      setPeopleCount(response.data.total_people);
      setFramesProcessed(response.data.frames_processed);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Something went wrong while processing the video!');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPeopleCount(null);
    setFramesProcessed(null);
    setMode(null);
  };
  const reset1 = () => {
    setPeopleCount(0);
    setFramesProcessed(0);
  };

  return (
    <videoContext.Provider value={{ peopleCount, framesProcessed, reset1 }}>
      <div className="main-container">

        {/* Mode selection */}
        {!mode && (
          <div className="webcam-dragdrop">
            <div className="webcam">
              <button onClick={() => setMode('upload')} className="webcam-btn">
                Upload Video
              </button>
            </div>
            <div className="drag-drop">
              <button onClick={() => setMode('dragdrop')} className="drag-drop-btn">
                Drag and Drop
              </button>
            </div>
          </div>
        )}

        {/* Upload mode */}
        {mode === 'upload' && (
          <div className="webcam-container">
            {!peopleCount ? (
              <>
                <input type="file" accept="video/*" onChange={handleFileChange} />
                <div className="btn">
                  <button onClick={handleUpload} disabled={loading}>
                    {loading ? 'Processing...' : 'Upload Video'}
                  </button>
                  <button onClick={reset} className="cancel">✕ Cancel</button>
                </div>
              </>
            ) : (
              <div className="result-box">
                <Dashboard /> {/* Now correctly inside Provider */}
                <div className="btn">
                  <button onClick={reset}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drag and Drop mode */}
        {mode === 'dragdrop' && (
          <div className="drag-and-drop">
            <DragDropFile />
          </div>
        )}
      </div>
    </videoContext.Provider>
  );
};

export default CameraZones;
