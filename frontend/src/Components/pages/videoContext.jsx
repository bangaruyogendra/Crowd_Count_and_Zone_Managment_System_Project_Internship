import React, { createContext, useState } from "react";

const videoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [peopleCount, setPeopleCount] = useState(0);
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [cameraZonespeopleCount, setCameraZonespeopleCount] = useState(0);
  const [cameraZonesframesProcessed, setCameraZonesframesProcessed] = useState(0);

  const reset = () => {
    setPeopleCount(0);
    setFramesProcessed(0);
  };

  return (
    <videoContext.Provider
      value={{
        peopleCount,
        setPeopleCount,
        framesProcessed,  
        setFramesProcessed,
        cameraZonespeopleCount,
        setCameraZonespeopleCount,
        cameraZonesframesProcessed,
        setCameraZonesframesProcessed,
        reset,
        
      }}
    >
      {children}
    </videoContext.Provider>
  );
};

export default videoContext;
