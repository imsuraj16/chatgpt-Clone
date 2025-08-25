import React, { useEffect } from "react";
import Mainroutes from "./routes/Mainroutes";
import { useDispatch } from "react-redux";
import { getUser } from "./store/actions/userActions";
import { getChats } from "./store/actions/chatActions";

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getUser());
    dispatch(getChats());
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen">
      <Mainroutes />
    </div>
  );
};

export default App;
