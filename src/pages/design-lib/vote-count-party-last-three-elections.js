import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
} from "react-vis"

const VoteCountPartyLastThreeElections = () => {
  const bjpData = [
    { x: "2009", y: 68000 },
    { x: "2014", y: 76000 },
    { x: "2019", y: 88000 },
  ]

  const congData = [
    { x: "2009", y: 88000 },
    { x: "2014", y: 57000 },
    { x: "2019", y: 28000 },
  ]

  const bspData = [
    { x: "2009", y: 42000 },
    { x: "2014", y: 17000 },
    { x: "2019", y: 47000 },
  ]

  const spData = [
    { x: "2009", y: 9000 },
    { x: "2014", y: 5000 },
    { x: "2019", y: 11000 },
  ]

  const othersData = [
    { x: "2009", y: 15000 },
    { x: "2014", y: 11000 },
    { x: "2019", y: 14000 },
  ]

  return (
    <div>
      <div className="widget-title">
        Number of Constituencies Won by Aliances in last three elections
      </div>
      <XYPlot
        xType="ordinal"
        width={650}
        height={450}
        xDistance={50}
        className="mx-auto my-10"
        margin={{ left: 100 }}
      >
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries data={bjpData} color={"#F97D09"} stroke={"#fff"} />
        <VerticalBarSeries data={congData} color={"#BD0026"} stroke={"#fff"} />
        <VerticalBarSeries data={bspData} color={"#138808"} stroke={"#fff"} />
        <VerticalBarSeries data={spData} color={"#000"} stroke={"#fff"} />
        <VerticalBarSeries
          data={othersData}
          color={"#A6A6A6"}
          stroke={"#fff"}
        />
        <div className="flex justify-between w-8/12 my-4 mx-auto">
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
            <div>CONG</div>
          </div>
          <div className="grid justify-items-center ">
            <div
              className="w-10 h-2"
              style={{ backgroundColor: "#138808" }}
            ></div>
            <div>BSP</div>
          </div>
          <div className="grid justify-items-center ">
            <div className="w-10 h-2" style={{ backgroundColor: "#333" }}></div>
            <div>SP</div>
          </div>
          <div className="grid justify-items-center ">
            <div
              className="w-10 h-2"
              style={{ backgroundColor: "#a6a6a6" }}
            ></div>
            <div>Others</div>
          </div>
        </div>
      </XYPlot>
    </div>
  )
}

export default VoteCountPartyLastThreeElections
