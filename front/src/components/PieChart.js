import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PieChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(()=>{
        if (chartInstance.current){
            chartInstance.current.destroy()
        }
        const myChartRef = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(myChartRef, {
            type:'doughnut',
            data: data, 
        })
        return () =>{
            if(chartInstance.current){
                chartInstance.current.destroy()
            }
        }
    }, [data]);

  return (
    <div>
        <canvas ref={chartRef}/>
    </div>
  );
}
export default PieChart;