import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PieChart({ course }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    let hour = course.hours - course.attendance - course.absence - course.permission
    const data = {
        labels: [
          'Attendance',
          'Absence',
          'Permission',
          'Not submitted'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [course.attendance, course.absence, course.permission, hour],
          backgroundColor: [
            'rgb(0, 128, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 205, 86)',
            'rgb(128, 128, 128)'
          ],
          hoverOffset: 4
        }]
      };

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
    }, []);

  return (
    <div>
        <canvas ref={chartRef} style={{width:"300px", height:"200px"}}/>
    </div>
  );
}
export default PieChart;