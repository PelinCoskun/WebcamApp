import axios from 'axios';
import React, { useState } from 'react';
import './VideoStream.css';

const VideoStream = () => {
  const [countdown, setCountdown] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startCapture = async () => {
    try {
      await axios.post('http://localhost:5001/start_capture');
      setCountdown(10);
      setIsCompleted(false);

      const id = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            setIsCompleted(true);
            clearInterval(id);
            return 0;
          }
        });
      }, 1000);

      setIntervalId(id);
    } catch (error) {
      console.error('Capture başlatılırken hata oluştu:', error.message);
    }
  };

  const handleButtonClick = async () => {
    try {
      await startCapture();
      setCountdown(10);
      setIsCompleted(false);

      const id = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            setIsCompleted(true);
            clearInterval(id);
            setTimeout(() => {
              setIsCompleted(false);
            }, 2000);
            return 0;
          }
        });
      }, 1000);

      setIntervalId(id);
    } catch (error) {
      console.error('Fotoğraf çekilirken hata oluştu:', error.message);
    }
  };

  return (
    <div className="App">
      <div className="video-feed-container"> 
        <img className="video-feed" src="http://localhost:5001/video_feed" alt="Webcam Feed" />
      </div>
      {countdown !== null && countdown > 0 && !isCompleted && (
        <div className="counter">Kalan süre: {countdown} saniye</div>
      )}
      {countdown === 0 && isCompleted && (
        <div className="completed-message">İşlem Tamamlandı</div>
      )}
      <button className="capture-button" onClick={handleButtonClick}>
        Fotoğraf Çek
      </button>
    </div>
  );
};

export default VideoStream;
