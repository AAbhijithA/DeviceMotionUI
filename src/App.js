import logo from './logo.svg';
import './App.css';
import { use, useState } from 'react';

function App() {
  const [acceleration, setAcceleration] = useState(null);
  const [xAcceleration, setXAcceleration] = useState(0);
  const [yAcceleration, setYAcceleration] = useState(0);
  const [zAcceleration, setZAcceleration] = useState(0);
  const [overallAcceleration, setOverallAcceleration] = useState(0);

  function updateAccelerationObject(event) {
    setAcceleration(event.acceleration);
  }

  function updateAcceleration() {
    if(acceleration) {
      const x = acceleration.x ? acceleration.x.toFixed(2) : 0;
      const y = acceleration.y ? acceleration.y.toFixed(2) : 0;
      const z = acceleration.z ? acceleration.z.toFixed(2) : 0;
      setXAcceleration(x);
      setYAcceleration(y);
      setZAcceleration(z);
      setOverallAcceleration(
        Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)).toFixed(2)
      );
    }
  }

  if(window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', updateAccelerationObject);
  }
  else {
    alert("DeviceMotionAPI not supported");
  }

  setInterval(updateAcceleration, 1000);

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
