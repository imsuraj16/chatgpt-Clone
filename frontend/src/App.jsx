import React, { useEffect } from "react";
import Mainroutes from "./routes/Mainroutes";
import { useDispatch, useSelector } from "react-redux";
import { getChats } from "./store/actions/chatActions";
import { fetchUser } from "./store/actions/userActions";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  
  // Fetch user once on app mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Fetch chats whenever user becomes available (login or refresh auth restore)
  useEffect(() => {
    if (user) {
      dispatch(getChats());
    }
  }, [user, dispatch]);

  return (
    <div className="w-full min-h-screen">
      <Mainroutes />
    </div>
  );
};

export default App;
