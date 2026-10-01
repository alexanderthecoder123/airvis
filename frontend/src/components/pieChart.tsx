import {useEffect, useState} from 'react';
import {Pie} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend, ChartOptions,
} from 'chart.js';
import {useGlobalState} from "../context/state.tsx";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // subscribe to filtering state
  const { filters } = useGlobalState();

  // load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`http://localhost:8000/chart2/${filters.location}`);
        const data = await resp.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters.location]);

  if (loading) return <div>Loading...</div>;

  const labels = chartData.map((val: any) => val.room_type);
  const vals = chartData.map((val: any) => val.count);
  const data = {
    labels: labels,
    datasets: [
      {
        data: vals,
        backgroundColor: [
          "#4e73df", // Soft Blue
          "#1cc88a", // Soft Green
          "#36b9cc", // Light Cyan
          "#f6c23e", // Warm Yellow
          "#e74a3b", // Soft Red
          "#858796", // Neutral Gray
          "#f8d7da", // Light Pink
          "#5a5c69", // Slate Gray
        ]
      }
    ]
  }

  const options : ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Legend positioned at the bottom
        labels: {
          padding: 20, // Adds space between the legend and chart
        },
      },
      title: {
        display: true,
        text: 'Room Type Distribution', // Chart title
      },
    },
  };

  return (
    <div style={{width: '300px', margin: '0 auto', marginTop: '50px'}}>
      <Pie data={data} options={options} />
    </div>
  )
}


export default PieChart;
