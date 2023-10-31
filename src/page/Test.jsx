import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';

function CountdownTimer() {
  const initialTime =1 * 60 ; // 10 phút

  // Kiểm tra xem có trạng thái trước đó trong Local Storage không
  const previousTimeLeft = localStorage.getItem('timeLeft');
  const [timeLeft, setTimeLeft] = useState(previousTimeLeft ? parseInt(previousTimeLeft) : initialTime);

  // Lưu trạng thái vào Local Storage khi thời gian đang chạy
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
        localStorage.setItem('timeLeft', timeLeft - 1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [timeLeft]);

  // Xóa trạng thái trong Local Storage sau khi sử dụng
  useEffect(() => {
    if (previousTimeLeft) {
      localStorage.removeItem('timeLeft');
    }
  }, []);

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <div>
        <h1 className='font-medium text-lg text-orange-500'>
          Thời gian còn lại : {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </h1>
      </div>
    );
  };

  return (
    <div>
      <Countdown date={Date.now() + timeLeft * 1000} renderer={renderer} onComplete={() => alert('Thời gian đã hết!')} />
    </div>
  );
}

export default CountdownTimer;
