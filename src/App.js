import { useEffect, useRef, useState, use } from 'react';
import './App.css';

function App() {
  const [acceleration, setAcceleration] = useState(null);
  const [xAcceleration, setXAcceleration] = useState(0);
  const [yAcceleration, setYAcceleration] = useState(0);
  const [zAcceleration, setZAcceleration] = useState(0);
  const [overallAcceleration, setOverallAcceleration] = useState(0);

  const accelerationRef = useRef(null);

  useEffect(() => {
    function updateAccelerationObject(event) {
      setAcceleration(event.acceleration);
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', updateAccelerationObject);
    } else {
      alert('DeviceMotionAPI not supported');
    }

    return () => {
      window.removeEventListener('devicemotion', updateAccelerationObject);
    };
  }, []);

  useEffect(() => {
    accelerationRef.current = acceleration;
  }, [acceleration]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (accelerationRef.current) {
        const x = accelerationRef.current.x ? accelerationRef.current.x.toFixed(2) : 0;
        const y = accelerationRef.current.y ? accelerationRef.current.y.toFixed(2) : 0;
        const z = accelerationRef.current.z ? accelerationRef.current.z.toFixed(2) : 0;

        setXAcceleration(x);
        setYAcceleration(y);
        setZAcceleration(z);
        setOverallAcceleration(
          Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)).toFixed(2)
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Device Motion</h1>
      <div>Acceleration X: {xAcceleration}</div>
      <div>Acceleration Y: {yAcceleration}</div>
      <div>Acceleration Z: {zAcceleration}</div>
      <div>Overall Acceleration: {overallAcceleration}</div>
    </div>
  );
}

export default App;
