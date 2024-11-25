import React, { useState, useEffect } from "react";
import ".//styles/RealTimeClock.css";

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(timer);
  }, []);

  // Formatea la hora en formato HH:MM:SS
  const formattedTime = time.toLocaleTimeString();

  return (
    <div>
      <p className="pReloj">{formattedTime}</p>
    </div>
  );
};

export default RealTimeClock;
