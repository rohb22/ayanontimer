import { useRef, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useAppContext } from "../AppProvider";

const Settings = forwardRef((props, ref) => {
  const modalRef = useRef();
  const { settings, setSettings } = useAppContext();

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.showModal(),
    close: () => modalRef.current?.close(),
  }));

  const [allowNotif, setAllowNotif] = useState(() => 
    typeof window !== 'undefined' ? Notification?.permission === "granted" : false
  );

  useEffect(() => {
    setAllowNotif(settings.notifications);
  }, [settings.notifications]);

  const handleAllowNotification = () => {
    if (!allowNotif && typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          setAllowNotif(true);
          setSettings({ ...settings, notifications: true });
        }
      });
    } else {
      setAllowNotif(false);
      setSettings({ ...settings, notifications: false });
    }
  };

  const handleToggle = (key) => (e) => {
    setSettings({ ...settings, [key]: e.target.checked });
  };

  const handleNumberChange = (key) => (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setSettings({ ...settings, [key]: value });
    }
  };

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white/80 backdrop-blur-sm">
        <h3 className="font-bold text-lg text-black-400 mb-4">Settings</h3>

        <div className="space-y-4">
          <label className="label flex justify-between items-center">
            <span className="text-gray-800">Notifications</span>
            <input
              type="checkbox"
              checked={allowNotif}
              onChange={handleAllowNotification}
              className="toggle"
            />
          </label>

          <label className="label flex justify-between items-center">
            <span className="text-gray-800">Music</span>
            <input
              type="checkbox"
              checked={settings.music}
              onChange={handleToggle("music")}
              className="toggle"
            />
          </label>
          {settings.music && (
            <label className="label flex flex-col items-start space-y-1">
              <span className="text-gray-800">Music Volume</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(settings.musicVol * 100)}
                onChange={(e) =>
                  setSettings({ ...settings, musicVol: Number(e.target.value) / 100 })
                }
                className="range range-primary"
              />
              <div className="text-sm text-gray-600">
                Volume: {Math.round(settings.musicVol * 100)}%
              </div>
            </label>
          )}


          {/* <label className="label flex justify-between items-center">
            <span className="text-gray-300">Study Music</span>
            <input
              type="checkbox"
              checked={settings.studyMusic}
              onChange={handleToggle("studyMusic")}
              className="toggle toggle-error"
            />
          </label>

          <label className="label flex justify-between items-center">
            <span className="text-gray-300">Rest Music</span>
            <input
              type="checkbox"
              checked={settings.restMusic}
              onChange={handleToggle("restMusic")}
              className="toggle toggle-error"
            />
          </label> */}

          <label className="label flex justify-between items-center">
            <span className="text-gray-800">Max Study Time (mins)</span>
            <input
              type="number"
              value={settings.maxStudyTime}
              onChange={handleNumberChange("maxStudyTime")}
              min={1}
              className="input input-bordered w-20 text-black"
            />
          </label>

          <label className="label flex justify-between items-center">
            <span className="text-gray-800">Max Rest Time (mins)</span>
            <input
              type="number"
              value={settings.maxRestTime}
              onChange={handleNumberChange("maxRestTime")}
              min={1}
              className="input input-bordered w-20 text-black"
            />
          </label>

          <div className="mt-4">
            <a
              href="https://github.com/rohb22/ayanontimer/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="link text-[#615fff]"
            >
              Report A Bug
            </a>
          </div>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-outline"
            onClick={() => modalRef.current?.close()}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default Settings;