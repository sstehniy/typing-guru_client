/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
import React, { useEffect, useRef, CSSProperties } from "react";
import Chart from "chart.js";

type ChartComponent = {
  config: {
    labels: string[];
    datasets: {
      label: string;
      data: any[];
      backgroundColor?: string[] | string;
      borderColor?: string[] | string;
    }[];
  };
  style?: CSSProperties;
  className?: string;
};

const defaultStyle: CSSProperties = {
  height: 400,
  width: "55%",
  marginBottom: 30
};

const ChartComponent = ({
  config: { labels, datasets },
  style = defaultStyle,
  className = ""
}: ChartComponent) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    });
    return () => {
      chart.destroy();
    };
  }, [chartRef, datasets, labels]);
  return (
    <div style={{ ...style }}>
      <canvas
        ref={chartRef}
        aria-label="test_chart"
        style={{
          height: "100%",
          width: "100%"
        }}
        className={className}
      >
        <p>Hello Fallback World</p>
      </canvas>
    </div>
  );
};

export default ChartComponent;
