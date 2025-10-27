import React, { useContext } from 'react';
import  videoContext  from './videoContext';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer,Label,Scatter,ScatterChart } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { peopleCount, framesProcessed, reset } = useContext(videoContext);

  const data = [
    { People: peopleCount, Frames: framesProcessed },
    { People: peopleCount , Frames: framesProcessed + 50 },
    { People: peopleCount , Frames: framesProcessed + 70 },
    { People: peopleCount , Frames: framesProcessed + 90 },
    { People: peopleCount , Frames: framesProcessed + 120 },
  ];

  return (
  <div className = "Dashboard-Main">
    
    <div className ="Dashboard-charts">
     <div class="title-bar">
        <h4>LinePlot Frames vs People</h4>
    </div>
      <LineChart
         style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
         responsive
         data={data}
         margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
      >
           <CartesianGrid strokeDasharray="4" stroke="black" />
           <XAxis dataKey="Frames">
            <Label value="Frames" offset={-5} position="insideBottom" />
           </XAxis>
           <YAxis width="auto" name ="No of People" label={{
              value: 'People Count',
              angle: -90,
              position: 'insideLeft',
              textAnchor: 'middle',
           }}/>
           <Tooltip/>
           <Line type="monotone" dataKey="People" stroke="darkblue" />
      </LineChart>
    
    </div>

    <div className = "scatterPlot">
      <div class="title-bar">
        <h4>Scatter Plot</h4>
      </div>
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart
                 margin={{
                   top: 10,
                   right: 10,
                   bottom: 10,
                   left: 10,
                }}
               >
              <CartesianGrid strokeDasharray="4" stroke="black" />
              <XAxis dataKey="Frames" type="number" name="Frames">
                <Label value="Frames" offset={-5} position="insideBottom" />
              </XAxis>
              <YAxis dataKey="People" type="number" name="People" label={{
              value: 'People Count',
              angle: -90,
              position: 'insideLeft',
              textAnchor: 'middle',
              }}/>
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
             
             <Scatter name="People per Frame" data={data} fill="lightgreen" />
             </ScatterChart>
            </ResponsiveContainer>
            

    </div>

  </div>
  );
};

export default Dashboard;
