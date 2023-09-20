import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Sheet, Typography, useTheme } from "@mui/joy";
import { url } from "../utils/utils";
import Loading from "./Loading";
import { useMediaQuery } from "@mui/material";

ChartJS.register(
  TimeScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function Memory() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (message) => {
      // get data from message
      const data = JSON.parse(message.data);
      // if message is about server status, update relevant status
      if (data.type === "memory") {
        setLoading(false);
        let received = [];
        for (const item of data.usage.items) {
          // @ts-ignore
          received.push(item);
        }
        setChartData(received);
      }
    };

    return () => ws.close();
  }, []);

  const [chartData, setChartData] = useState<
    { time: number; usage: number | StorageEstimate }[]
  >([
    {
      time: Date.now(),
      usage: 0,
    },
  ]);

  const dataset = {
    labels: chartData ? chartData.map((item) => item.time) : [],
    datasets: [
      {
        label: "Memory Usage",
        data: chartData ? chartData.map((item) => item.usage) : [],
        fill: true,
        backgroundColor: "rgba(9, 107, 222, 0.2)",
        borderColor: "rgb(9, 107, 222)",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
          stepSize: 10,
          displayFormats: {
            second: "HH:mm:ss",
          },
          tooltipFormat: "HH:mm:ss",
        },
        title: {
          display: !mobile,
          text: "Time",
        },
        ticks: {
          callback: function (value, index) {
            if (index % 10 === 0) {
              return new Date(value).toLocaleTimeString();
            } else {
              return null;
            }
          },
        },
      },
      y: {
        title: {
          display: !mobile,
          text: "Memory Usage (%)",
        },
        min: 0,
        max: 100,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (tooltipItem) {
            return tooltipItem[0].time;
          },
          label: function (context) {
            return `Memory Usage: ${context.parsed.y}%`;
          },
        },
      },
      filler: {
        propagate: false,
      },
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <Sheet
      variant="outlined"
      sx={{
        p: { xs: 1, md: 2 },
        borderRadius: "sm",
        boxShadow: "sm",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography
        level={mobile ? "title-md" : "h3"}
        sx={{
          alignSelf: "center",
          mb: 1,
        }}
      >
        Memory Usage
      </Typography>
      <Sheet
        sx={{
          height: "90%",
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          // @ts-ignore
          <Chart type="line" data={dataset} options={options} />
        )}
      </Sheet>
    </Sheet>
  );
}
