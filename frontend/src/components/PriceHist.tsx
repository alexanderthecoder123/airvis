import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import {useGlobalState} from "../context/state.tsx";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required PriceHist.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PriceHist() {
  const [chartData, setChartData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { filters } = useGlobalState();

  // load data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(`http://localhost:8000/files/${filters.location}`);
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

  // IDEA: COULD ALSO DO THIS STACKED BY TYPE OF LISTING (ROOM_TYPE IN DB)
  // Ensure chartData is available and has the correct format
  if (loading) return <div>Loading...</div>;

  const labels = chartData?.map((val: any) => val.breaks); // Assuming 'breaks' is the bin upper limit
  const counts = chartData?.map((val: any) => val.count); // Assuming 'count' is the number of values in the bin

  const data = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Average price per night in {AREA}, (5% top bottom cut)',
      },
    },
  };

  return (
    <div style={{ width: '400px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default React.memo(PriceHist);
