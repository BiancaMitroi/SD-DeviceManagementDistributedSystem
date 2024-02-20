import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface Props {
    chartName: number;
    values: number[];
    timestamps: string[];
    threshold: number; // Threshold for color change condition
}

const Chart: React.FC<Props> = (props) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<any>(null);
    console.log(props);

    useEffect(() => {
        if (chartRef.current && !chartInstance.current) {
            const options = {
              fill: {
                colors: [function({ value } : {value: number }) {
                  if (value < props.threshold) {
                      return '#7fffd4'
                  } else {
                      return '#D9534F'
                  }
                }]
              },
                chart: {
                    type: 'bar',
                },
                series: [
                    {
                        name: 'sensor' + props.chartName.toString(),
                        data: props.values.map((item) => Math.round(item * 100) / 100),
                    }
                ],
                xaxis: {
                    categories: props.timestamps
                },
                yaxis: {
                    labels: {
                      formatter: function(nb: number) {
                        return Math.round(nb * 100) / 100;
                      }
                    }
                  }
            };

            chartInstance.current = new ApexCharts(chartRef.current, options);
            chartInstance.current.render();
        }
    }, [props.values, props.timestamps, props.threshold, props.chartName]);

    return <div ref={chartRef} />;
};

export default Chart;
