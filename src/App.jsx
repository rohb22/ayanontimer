import { useAppContext } from "./AppProvider";
import UpperBar from "./components/UpperBar";
import { useEffect } from "react";
import Timer from "./components/Timer";

const App = () => {

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === "default") {
      alert("Kindly turn on notification in the settings for better experience");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <UpperBar />
      <Timer />
    </div>
  );
};

export default App;
