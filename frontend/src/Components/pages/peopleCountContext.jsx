import { createContext } from "react";

const peopleCountContext = createContext({
  count: null,
  reset1: () => {},
  
});

export default peopleCountContext;
