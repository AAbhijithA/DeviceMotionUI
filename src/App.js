import { useEffect, useRef, useState } from 'react';
import { Line } from "react-chartjs-2";
import './App.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [acceleration, setAcceleration] = useState(null);
  const [xAcceleration, setXAcceleration] = useState(0);
  const [yAcceleration, setYAcceleration] = useState(0);
  const [zAcceleration, setZAcceleration] = useState(0);
  const [overallAcceleration, setOverallAcceleration] = useState(0);
  const [data, setData] = useState({
      labels: [1],
      datasets: [
        {
          label: "Acceleration",
          data: [0],
          fill: true,
          backgroundColor: "rgba(197, 124, 233, 0.2)",
          borderColor: "rgb(23, 5, 33)"
        }
      ]
    }
  )
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
  };

  const accelerationRef = useRef(null);

  useEffect(() => {
    function updateAccelerationObject(event) {
      setAcceleration(event.acceleration);
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', updateAccelerationObject);
    }
    else {
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
      if(accelerationRef.current) {
        const x = accelerationRef.current.x ? accelerationRef.current.x.toFixed(2) : 0;
        const y = accelerationRef.current.y ? accelerationRef.current.y.toFixed(2) : 0;
        const z = accelerationRef.current.z ? accelerationRef.current.z.toFixed(2) : 0;
        setXAcceleration(x);
        setYAcceleration(y);
        setZAcceleration(z);
        const newOverallAcceleration = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)).toFixed(2);
        setOverallAcceleration(newOverallAcceleration);
        setData((prevData) => ({
          labels: [...prevData.labels, prevData.labels[prevData.labels.length - 1] + 1],
          datasets: [
            {
              label: "Acceleration",
              data: [...prevData.datasets[0].data, newOverallAcceleration],
              fill: true,
              backgroundColor: "rgba(152, 42, 207, 0.2)",
              borderColor: "rgb(22, 8, 30)"
            }
          ]
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Device Motion</h1>
      <div>Acceleration X: {xAcceleration}</div>
      <div>Acceleration Y: {yAcceleration}</div>
      <div>Acceleration Z: {zAcceleration}</div>
      <div>Overall Acceleration: {overallAcceleration}</div>
      <Line options={options} data={data} />
    </div>
  );
}

export default App;
