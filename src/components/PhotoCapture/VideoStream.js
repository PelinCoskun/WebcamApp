import axios from 'axios';
import React, { useState } from 'react';
import './VideoStream.css';

const VideoStream = () => {
  const [countdown, setCountdown] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const startCapture = async () => {
    try {
      console.log("!!!!!!!!!!!!!!!!!!!!!")
      await axios.post('http://localhost:5001/start_capture');
      setCountdown(10);
      setIsCompleted(false);
    //  setIsButtonDisabled(true)
    console.log("^^^^^^^^^^^^^^^^^^^^^^")
    } catch (error) {
      console.error('Capture başlatılırken hata oluştu:', error.message);
      throw new Error("Fotoğraf çekme işlemi başlatılamadı.")
    }
  };

  const handleButtonClick = async () => {
    console.log("butona tıkladın")
    try {
      await startCapture();
      setCountdown(10);
      setIsCompleted(false);
      setIsButtonDisabled(true)

      const id = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown > 0) {
            return prevCountdown - 1;
          } else {
            setIsCompleted(true);
            clearInterval(id);
            setTimeout(() => {
              setIsCompleted(false);
              setIsButtonDisabled(false)
            }, 2000);
            return 0;
          }
        });
      }, 1000);

      setIntervalId(id);
    } catch (error) {
      console.error('Fotoğraf çekilirken hata oluştu:', error.message);
      alert("Fotoğraf çekme işlemi başlatılamadı.Lütfen tekrar deneyin")
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
      <button className={`capture-button ${isButtonDisabled ? 'disabled' : ''}`} 
      onClick={handleButtonClick} 
      disabled={isButtonDisabled}
      style={{backgroundColor:isButtonDisabled? 'gray':'#3044b5'}}>
        Fotoğraf Çek
      </button>
    </div>
  );
};

export default VideoStream;
