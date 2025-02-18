import { useEffect, useRef, useState } from 'react';
import { Line } from "react-chartjs-2";
import './App.css';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
} from 'react-leaflet'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UpdateMarker = ({ pos }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(pos, map.getZoom());
  }, [pos, map]);
  return <Marker position={pos} />;
};

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
  );
  const [pos, setPosition] = useState([51.505, -0.09]);
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
      navigator.geolocation.getCurrentPosition(function(position) {
        setPosition([position.coords.latitude, position.coords.longitude]);
      });
      console.log(pos)
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="map-section">
        <h2 className="map-title">Location Map</h2>
        <div className="map-container">
          <MapContainer center={pos} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <UpdateMarker pos={pos} />
          </MapContainer>
        </div>
      </div>

      <div className="motion-section">
        <h1 className="motion-title">Device Motion</h1>
        <div className="acceleration-grid">
          <div>Acceleration X: {xAcceleration}</div>
          <div>Acceleration Y: {yAcceleration}</div>
          <div>Acceleration Z: {zAcceleration}</div>
          <div>Overall Acceleration: {overallAcceleration}</div>
        </div>
        <div className="chart-container">
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
