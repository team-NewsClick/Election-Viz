import { useState, useEffect } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import ItemSeries from "highcharts/modules/item-series"

if (typeof Highcharts === "object") {
  ItemSeries(Highcharts)
}

const RegionSummary = () => {
  const [options, setOptions] = useState({
    chart: {
      type: "item",
      width: null,
      height: 200,
      backgroundColor: "transparent",
    },
    title: {
      text: "",
    },
    subtitle: {
      enabled: false,
    },
    series: [
      {
        name: "Constituencies",
        keys: ["name", "y", "color", "label"],
        data: [
          ["NDA", 56, "#f97d09", "BJP"],
          ["BSP", 11, "#bd0026", "BSP"],
          ["INC", 38, "#138808", "INC"],
          ["IND", 6, "#000", "IND"],
          ["Others", 4, "#a6a6a6", "Others"]
        ],
        dataLabels: {
          enabled: false,
          format: "{point.label}",
        },

        // Circular options
        center: ["34%", "115%"],
        size: "250%",
        startAngle: -90,
        endAngle: 90,
      },
    ],

    legend: {
      enabled: false,
    },
  })

  const regionType = "state"
  return (
    <div className="">
      <div className="bg-gray-50 max-w-lg rounded border border-gray-300 py-0.5">
        {regionType == "state" ? (
          <div>
            <div className="flex justify-center mt-8">
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={"chart"}
                options={options}
                allowChartUpdate={true}
                immutable={false}
                updateArgs={[true, true, true]}
                containerProps={{ className: "chartContainer" }}
              />
            </div>
            <div className="flex justify-between mx-4 mt-9 mb-10">
              <div className="grid justify-items-center ">
                <div
                  className="w-10 h-2"
                  style={{ backgroundColor: "#f97d09" }}
                ></div>
                <div>NDA: 78</div>
              </div>
              <div className="grid justify-items-center ">
                <div
                  className="w-10 h-2"
                  style={{ backgroundColor: "#bd0026" }}
                ></div>
                <div>BSP: 11</div>
              </div>
              <div className="grid justify-items-center ">
                <div
                  className="w-10 h-2"
                  style={{ backgroundColor: "#138808" }}
                ></div>
                <div>INC: 38</div>
              </div>
              <div className="grid justify-items-center ">
                <div
                  className="w-10 h-2"
                  style={{ backgroundColor: "#333" }}
                ></div>
                <div>IND1; 6</div>
              </div>
              <div className="grid justify-items-center ">
                <div
                  className="w-10 h-2"
                  style={{ backgroundColor: "#a6a6a6" }}
                ></div>
                <div>Others: 4</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center my-8">BJP</div>
        )}
        {regionType == "state" ? (
          <div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Chief Minister</div>
              <div className="w-2/5">Yogi Adityanath</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">State</div>
              <div className="w-2/5">Uttar Pradesh</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Gender</div>
              <div className="w-2/5">Male</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Education</div>
              <div className="w-2/5">Graduate</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Criminal Record</div>
              <div className="w-2/5">No</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">First time as MP/MLA</div>
              <div className="w-2/5">No</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Party</div>
              <div className="w-2/5">BJP</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Alliance</div>
              <div className="w-2/5">NDA</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Contituencies Won</div>
              <div className="w-2/5">56</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Total Constituencies</div>
              <div className="w-2/5">86</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Winning Candidate</div>
              <div className="w-2/5">Yogi Adityanath</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Constituency</div>
              <div className="w-2/5">Gorakhpur</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">State</div>
              <div className="w-2/5">Uttar Pradesh</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Gender</div>
              <div className="w-2/5">Male</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Education</div>
              <div className="w-2/5">Graduate</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Criminal Record</div>
              <div className="w-2/5">No</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">First time as MP/MLA</div>
              <div className="w-2/5">No</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Party</div>
              <div className="w-2/5">BJP</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Alliance</div>
              <div className="w-2/5">NDA</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Contituencies Won</div>
              <div className="w-2/5">56</div>
            </div>
            <div className="flex my-2">
              <div className="w-3/5 font-bold">Total Constituencies</div>
              <div className="w-2/5">86</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegionSummary
