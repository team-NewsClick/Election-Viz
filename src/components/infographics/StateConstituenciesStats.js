import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalBarSeries
} from "react-vis"
import { useState, useEffect } from "react"
import PersonIcon from "../../../public/img/person-icon"

const StateConstituenciesStats = () => {
  useEffect(() => {
    setWindowWidth(window.innerWidth)
    return () => {}
  }, [])
  const [windowWidth, setWindowWidth] = useState(null)

  const ndaData = [{ x: 56, y: "NDA" }]
  const bspData = [{ x: 11, y: "BSP" }]
  const incData = [{ x: 38, y: "INC" }]
  const indData = [{ x: 6, y: "IND" }]
  const othersData = [{ x: 4, y: "Others" }]

  return (
    <div>
      <div className="md:flex mx-auto mt-12 px-2 md:justify-between pb-2 border-b-2 border-gray-400">
        <div className="flex">
          <div className="font-bold">State: &nbsp;</div>
          <div>Uttar Pradesh</div>
        </div>
        <div className="flex">
          <div className="font-bold">Total Constituencies: &nbsp;</div>
          <div>86</div>
        </div>
      </div>
      <div class="hidden lg:block">
        <div className="flex mx-auto mt-6 px-3">
          <div className="state-alliance-constituencies-container px-4 py-2">
            {Array(52).fill(
              <div className="px-1 py-1">
                <PersonIcon fill="#f97d09" />
              </div>
            )}
          </div>
          <div className="state-alliance-constituencies-container px-4 py-2">
            {Array(11).fill(
              <div className="px-1 py-1">
                <PersonIcon fill="#bd0026" />
              </div>
            )}
          </div>
          <div className="state-alliance-constituencies-container px-4 py-2">
            {Array(38).fill(
              <div className="px-1 py-1">
                <PersonIcon fill="#138808" />
              </div>
            )}
          </div>
          <div className="state-alliance-constituencies-container px-4 py-2">
            {Array(6).fill(
              <div className="px-1 py-1">
                <PersonIcon fill="#000" />
              </div>
            )}
          </div>
          <div className="state-alliance-constituencies-container px-4 py-2">
            {Array(4).fill(
              <div className="px-1 py-1">
                <PersonIcon fill="#a6a6a6" />
              </div>
            )}
          </div>
        </div>
        <div className="flex  mx-auto px-3">
          <div className="state-alliance-constituencies-container font-bold pt-4">
            <div style={{ color: "#f97d09" }}>NDA: 52</div>
          </div>
          <div className="state-alliance-constituencies-container font-bold pt-4">
            <div style={{ color: "#bd0026" }}>BSP: 11</div>
          </div>
          <div className="state-alliance-constituencies-container font-bold pt-4">
            <div style={{ color: "#138808" }}>INC: 38</div>
          </div>
          <div className="state-alliance-constituencies-container font-bold pt-4">
            <div style={{ color: "#138808" }}>IND: 6</div>
          </div>
          <div className="state-alliance-constituencies-container font-bold pt-4">
            <div style={{ color: "#a6a6a6" }}>Others: 4</div>
          </div>
        </div>
      </div>
      <div className="block lg:hidden">
        <XYPlot
          yType="ordinal"
          width={windowWidth * 0.98}
          height={windowWidth * 0.5}
          className="mx-auto mt-2"
          margin={{ left: 55 }}
          stackBy="x"
        >
          <VerticalGridLines />
          <XAxis />
          <YAxis />
          <HorizontalBarSeries data={ndaData} color={"#f97d09"} />
          <HorizontalBarSeries data={bspData} color={"#bd0026"} />
          <HorizontalBarSeries data={incData} color={"#138808"} />
          <HorizontalBarSeries data={indData} color={"#000"} />
          <HorizontalBarSeries data={othersData} color={"#a6a6a6"} />
        </XYPlot>
      </div>
    </div>
  )
}

export default StateConstituenciesStats
