import { useRef, useEffect } from "react";
import { useAppContext } from "./AppProvider";
import UpperBar from "./components/UpperBar";
import Timer from "./components/Timer";
import bgMusic from "./public/bgmusic.mp3"; 
import Quotes from "./components/Quotes";

const App = () => {
  const { settings } = useAppContext();
  const audioRef = useRef(null);

  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
  
      if (settings.music) {
        audio.volume = settings.musicVol;
        audio.play().catch((e) => console.warn("Audio play failed:", e));
      } else {
        audio.pause();
      }
    }, [settings.music, settings.musicVol]);

  return (
    <div className="min-h-screen bg-white">
      <audio ref={audioRef} src={bgMusic} loop />
      <UpperBar/>
      <Timer audioRef={audioRef} />
      <Quotes/>
    </div>
  );
};

export default App;
