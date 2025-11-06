import React, { useContext, useEffect, useState,useRef,useMemo } from 'react';
import videoContext from './videoContext';

import {
  XAxis, YAxis, CartesianGrid, Tooltip, Label,
  LineChart, Line, ResponsiveContainer, Bar, BarChart
} from 'recharts';

import './Dashboard.css';

const Dashboard = () => {
  
  const {
    peopleCount,
    framesProcessed,
    cameraZonespeopleCount,
    dropZonespeopleCount,
  } = useContext(videoContext);

  const [data, setData] = useState([]);
  
  const alertShown = useRef({
    video: false,
    camera: false,
    drop: false
  });

  useEffect(() => {
    setData((prev) => [
      ...prev.slice(-20),
      {
        Frames: framesProcessed,
        People: peopleCount,
        CameraZonePeople: cameraZonespeopleCount,
        DropZonePeople: dropZonespeopleCount,
      },
    ]);
  }, [peopleCount, framesProcessed, cameraZonespeopleCount, dropZonespeopleCount]);

  

  
   
const threshold = 10;


  useEffect(() => {

    if (peopleCount > threshold && !alertShown.current.video) {
      alert('⚠️ High People Count Detected in Video Zone!');
      alertShown.current.video = true;
    } else if (peopleCount <= threshold && alertShown.current.video) {
      alertShown.current.video = false;
    }

    if (cameraZonespeopleCount > threshold && !alertShown.current.camera) {
      alert('⚠️ High People Count Detected in Camera Zone!');
      alertShown.current.camera = true;
    } else if (cameraZonespeopleCount <= threshold && alertShown.current.camera) {
      alertShown.current.camera = false;
    }

    if (dropZonespeopleCount > threshold && !alertShown.current.drop) {
      alert('⚠️ High People Count Detected in Drop Zone!');
      alertShown.current.drop = true;
    } else if (dropZonespeopleCount <= threshold && alertShown.current.drop) {
      alertShown.current.drop = false;
    }
  }, [peopleCount, cameraZonespeopleCount, dropZonespeopleCount]);

  const boxData = useMemo(() => [
    { name: 'Video Zone', value: peopleCount },
    { name: 'Camera Zone', value: cameraZonespeopleCount },
    { name: 'Drop Zone', value: dropZonespeopleCount },
  ], [peopleCount, cameraZonespeopleCount, dropZonespeopleCount]);


  

  return (
    <div className="Dashboard-Main">
      <div className="Dashboard-title">Real Time Analytics</div>

      <div className="Dashboard-Row">
        <div className="Dashboard-charts">
          <div className="title-bar"><h4>Line Chart</h4></div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="4" stroke="black" />
              <XAxis dataKey="Frames">
                <Label value="Frames" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis label={{ value: 'People Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line type="linear" dataKey="People" stroke="darkblue" name="Video Zone" dot={false} />
              <Line type="natural" dataKey="CameraZonePeople" stroke="darkgreen" name="Camera Zone" dot={false} />
              <Line type="monotone" dataKey="DropZonePeople" stroke="darkred" name="Drop Zone" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="boxPlot">
          <div className="title-bar"><h4>Box Plot</h4></div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={boxData} barCategoryGap="60%">
              <CartesianGrid strokeDasharray="4" stroke="black" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'People Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e88e5" barSize={20} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
