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
  height: 250,
  width: 500
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
      }
    });
    return () => {
      chart.destroy();
    };
  }, [chartRef, datasets, labels]);
  return (
    <canvas
      ref={chartRef}
      aria-label="test_chart"
      style={{ ...style }}
      className={className}
    >
      <p>Hello Fallback World</p>
    </canvas>
  );
};

export default ChartComponent;
