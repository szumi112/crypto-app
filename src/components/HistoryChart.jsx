import { useParams } from "react-router-dom";
import fetchAxios from "../customHooks/fetchAxios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import Skeleton from "./Skeleton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const HistoryChart = () => {
  const { id } = useParams();
  const { response } = fetchAxios(
    `coins/${id}/market_chart?vs_currency=usd&days=1`
  );

  if (!response) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-72 w-full mb-10" />
      </div>
    );
  }
  const coinChartData = response.prices.map((value) => ({
    x: value[0],
    y: value[1],
  }));

  var options = {
    plugins: {
      legend: {
        display: "",
        labels: {
          color: "white",
          font: {
            size: 30,
            family: "verdana",
          },
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    radius: 3,
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
          color: "rgba(210,230,244,1)",
          font: {
            size: 12,
            family: "Verdana", // Add your font here to change the font of your legend label
          },
        },
        grid: {
          color: "rgba(255,255,255,0.02)",
        },
      },
      x: [
        {
          grid: {
            color: "rgba(255,255,255,1)",
          },
          ticks: {
            color: "rgba(210,230,244,1)",
            autoSkip: true,
            maxTicksLimit: 2,
            font: {
              family: "Verdana", // Add your font here to change the font of your legend label
            },
          },
        },
      ],
    },
  };

  const data = {
    labels: coinChartData.map((value) => moment(value.x).format("MMM DD")),
    datasets: [
      {
        fill: true,
        label: id,
        data: coinChartData.map((val) => val.y),
        backgroundColor: "rgba(255,116,89,0.05)",
        borderColor: "rgba(255,105,75,1)",
        borderWidth: 2,
        pointBorderColor: "#2984c5",
        pointBackgroundColor: "#fff",
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "black",
        fill: true,
        pointHoverBorderColor: "rgba(41, 132, 197, 1)",
        pointHoverBorderWidth: 7,
        pointRadius: 0,
        pointHitRadius: 30,
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
};

export default HistoryChart;
