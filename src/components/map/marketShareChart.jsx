import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import data from '../../pages/marketShareData.json';

function MarketShareChart() {
    const [expanded, setExpanded] = useState(false); // Create a variable to track expanded or not

    // To set the pie chart details
    const option = {
        tooltip: expanded
            ? {
                trigger: "item", 
                formatter: "{b}: {c} ({d}%)",
            }
            : { show: false },
        
        series: [
            {
                name: "Market Share",
                type: "pie",
                radius: expanded ? "50%" : "70%",
                center: ["50%", "50%"],  // Means horizontally and vertically centered
                data,
                avoidLabelOverlap: false,
                label: {
                    show: expanded,  // If the chart is expanded, show the label. If not, don't show
                    position: "outside",  // Outside the pie chart
                    formatter: "{b}: {d}%",
                    fontSize: expanded ? 8 : 5,
                    backgroundColor: 'transparent',
                },
                labelLine: {
                    show: expanded,
                    length: 40,
                    length2: 20,
                    smooth: true,
                },
                emphasis: {
                    label: {
                    show: true,
                    fontSize: 9,
                    fontWeight: "bold",
                    backgroundColor: 'transparent',
                    },
                },
                itemStyle: {
                    borderColor: "#696969",   // White border
                    borderWidth: 2,           // Thickness of the border
                },
            },
        ],
    };
      
  
    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={`z-[9999] fixed bottom-24 left-51 bg-blue-100 rounded-md text-gray-700 border-2 border-blue-100 cursor-pointer shadow-md transition-all duration-300 overflow-hidden flex flex-col items-center ${
                expanded ? 'w-[450px] h-[400px] justify-center' : 'w-[140px] h-[140px] pt-2 justify-start'
            } z-[9999]`} // <-- add this
        >
            {!expanded && ( // If the container is expanded
            <>
                <div className="flex flex-col items-center justify-center">
                    <div className="text-xs px-1 font-bold">Market Share FTTH</div>
                    <div className="text-xs px-1s">(Dec '23)</div>
                </div>

                <div className={`text-center italic font-light leading-none ${expanded ? 'text-xs' : 'text-[10px]'}`}>
                    Click to Expand
                </div>
            </>
            )}
            {expanded && (  // If the container is not expanded
            <>
                <div className="flex flex-col items-center justify-center">
                    <div className="text-sm px-1 font-bold mt-5">Market Share FTTH</div>
                    <div className="text-sm px-1s">(Dec '23)</div>
                </div>
                <div className={`text-center italic font-light leading-none ${expanded ? 'text-xs' : 'text-[10px]'}`}>
                    Click to Minimize
                </div>
            </>
            )}
            <ReactECharts
                option={option}  // Renders the pie chart using the option above
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "svg" }}
            />
        </div>
    )
}; 

export default MarketShareChart;