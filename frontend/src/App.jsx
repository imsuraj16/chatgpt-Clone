import React, { useEffect } from "react";
import Mainroutes from "./routes/Mainroutes";
import { useDispatch } from "react-redux";
import { getChats } from "./store/actions/chatActions";
import { fetchUser } from "./store/actions/userActions";

const App = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getChats());
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen">
      <Mainroutes />
    </div>
  );
};

export default App;
