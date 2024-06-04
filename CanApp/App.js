import React, { useReducer } from 'react';
import MyContext from "./configs/MyContext";
import NavigationApp from './navigation/NavigationApp';
import MyUserReducer from "./reducers/MyUserReducer";

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationApp />
    </MyContext.Provider>
  );
}


