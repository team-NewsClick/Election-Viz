import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
} from "react-vis"
import { useState, useEffect } from "react"

const ConstituenciesNumberLastThreeElections = () => {

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    return () => {}
  }, [])
  const [windowWidth, setWindowWidth] = useState(null)

  const ndaData = [
    { x: "2009", y: 68 },
    { x: "2014", y: 76 },
    { x: "2019", y: 88 },
  ]

  const bspData = [
    { x: "2009", y: 88 },
    { x: "2014", y: 57 },
    { x: "2019", y: 28 },
  ]

  const incData = [
    { x: "2009", y: 42 },
    { x: "2014", y: 17 },
    { x: "2019", y: 47 },
  ]

  const indData = [
    { x: "2009", y: 9 },
    { x: "2014", y: 5 },
    { x: "2019", y: 11 },
  ]

  const othersData = [
    { x: "2009", y: 15 },
    { x: "2014", y: 11 },
    { x: "2019", y: 14 },
  ]

  return (
    <div>
      <div className="widget-title">
        Number of Constituencies Won by Aliances in last three elections
      </div>
      <XYPlot
        xType="ordinal"
        width={windowWidth*0.98}
        height={windowWidth*0.7}
        className="mx-auto mt-10"
      >
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={ndaData} color={"#f97d09"} stroke={"#fff"} />
        <VerticalBarSeries data={bspData} color={"#bd0026"} stroke={"#fff"} />
        <VerticalBarSeries data={incData} color={"#138808"} stroke={"#fff"} />
        <VerticalBarSeries data={indData} color={"#000"} stroke={"#fff"} />
        <VerticalBarSeries
          data={othersData}
          color={"#a6a6a6"}
          stroke={"#fff"}
        />
      </XYPlot>
      <div className="flex justify-between w-10/12 mt-4 mx-auto">
          <div className="grid justify-items-center ">
            <div
              className="w-10 h-2"
              style={{ backgroundColor: "#f97d09" }}
            ></div>
            <div>BJP</div>
          </div>
          <div className="grid justify-items-center ">
            <div
              className="w-10 h-2"
              style={{ backgroundColor: "#bd0026" }}
            ></div>
            <div>BSP</div>
          </div>
          <div className="grid justify-items-center ">
            <div
              className="w-10 h-2"
              style={{ backgroundColor: "#138808" }}
            ></div>
            <div>INC</div>
          </div>
          <div className="grid justify-items-center ">
            <div className="w-10 h-2" style={{ backgroundColor: "#333" }}></div>
            <div>IND</div>
          </div>
          <div className="grid justify-items-center ">
            <div
              className="w-10 h-2"
              style={{ backgroundColor: "#a6a6a6" }}
            ></div>
            <div>Others</div>
          </div>
        </div>
    </div>
  )
}

export default ConstituenciesNumberLastThreeElections
