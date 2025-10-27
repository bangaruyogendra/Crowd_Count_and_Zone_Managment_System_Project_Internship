

import { createContext } from "react";

const videoContext = createContext({
  peopleCount: 0,
  framesProcessed: 0,
  reset: () => {},
});

export default videoContext;

