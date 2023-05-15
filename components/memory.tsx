import {useState, useEffect} from 'react';
import {Chart} from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
    Chart as ChartJS,
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
ChartJS.register(
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

import {Sheet, Typography} from "@mui/joy";

export default function Memory({ url }) {
    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onmessage = (message) => {
            // get data from message
            const data = JSON.parse(message.data);
            // if message is about server status, update relevant status
            if (data.type === 'memory') {
                console.log(`memory data received: ${data.usage}`);
                const usage = data.usage;
                setChartData((prevData) => [
                    ...prevData,
                    { time: Date.now(), usage },
                ]);
            }
        };


        return () => ws.close();
    }, [url]);

    const [chartData, setChartData] = useState<{time: number, usage: number | StorageEstimate}[]>([
        {
            time: Date.now(),
            usage: 0
        }
    ]);

    const dataset = {
        labels: chartData ? chartData.map((item) => item.time) : [],
        datasets: [
            {
                label: 'Memory Usage',
                data: chartData ? chartData.map((item) => item.usage) : [],
                fill: true,
                backgroundColor: 'rgba(9, 107, 222, 0.2)',
                borderColor: 'rgb(9, 107, 222)',
            }
        ]
    }

    const options = {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    stepSize: 10,
                    displayFormats: {
                        second: 'HH:mm:ss'
                    },
                    tooltipFormat: 'HH:mm:ss'
                },
                title: {
                    display: true,
                    text: 'Time'
                },
                ticks: {
                    callback: function(value, index) {
                        if (index % 10 === 0) {
                            return new Date(value).toLocaleTimeString();
                        } else {
                            return null;
                        }
                    }
                },
                max: Date.now(),
                min: Date.now() - 60 * 1000
            },
            y: {
                title: {
                    display: true,
                    text: 'Memory Usage (%)'
                },
                min: 0,
                max: 100
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
            tooltip: {
                displayColors: false,
                callbacks: {
                    title: function(tooltipItem) {
                        return tooltipItem[0].time;
                    },
                    label: function(context) {
                        return `Memory Usage: ${context.parsed.y}%`;
                    }
                }
            },
            filler: {
                propagate: false
            },
            legend: {
                display: false
            }
        },
        interaction: {
            intersect: false,
        },
    };

    // @ts-ignore
    return (
        <Sheet variant="outlined" sx={{
            p: 2,
            borderRadius: 'sm',
            boxShadow: 'sm',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
        }}>
            <Typography level="h3" sx={{
                alignSelf: 'center',
                mb: 1,
            }}>Memory Usage</Typography>
            <Sheet sx={{
                height: '90%',
            }}><Chart type="line" data={dataset} options={options} /></Sheet>
        </Sheet>
    );
};
