import { useEffect, useState } from "react"
import { promises as fs } from "fs"
import path from "path"
import { csvParse, autoType } from "d3-dsv"

// import MapDashboard from "../components/maps/MapDashboard"
// import { getCSVdata } from "../lib/loadCSV"

export async function getStaticProps() {
  // const allCSVData = await getCSVdata()
  const csvDirectory = path.join(process.cwd(), "/data/csv")
  const fileNames = await fs.readdir(csvDirectory)

  const allCSVData = fileNames.map(async (fileName) => {
    // const allCSVData = fileNames.map(async (fileName) => {
    const filePath = path.join(csvDirectory, fileName)
    const fileContents = await fs.readFile(filePath, "utf-8")
    // const fileContents = await fs.readFile(filePath, "utf-8")
    const csvData = csvParse(fileContents)
    return {
      fileName,
      content: csvData
    }
  })

  console.log("Data: ", allCSVData)
  const data = JSON.stringify(allCSVData)

  return {
    props: {
      // data: await Promise.all(allCSVData)
      allCSVData: data
    }
  }

  // const fileContents = await fs.readFile(
  //   "/home/mvs/Workspace/Office/dataviz/elections/election-viz/data/csv/assembly_2014.csv",
  //   "utf-8"
  // )
  // // console.log(fileContents)
  // const csvData = csvParse(fileContents)
  // // console.log(csvData)

  // return {
  //   props: {
  //     allCSVData: JSON.stringify(csvData)
  //   }
  // }
}

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = ({ allCSVData }) => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [districtGeojson, setDistrictGeojson] = useState([])

  console.log("Inside Page Function: ", allCSVData)

  useEffect(() => {
    const fetchStateGeojson = () => {
      fetch(`/geojson/states.geojson`)
        .then((res) => res.json())
        .then(setStateGeojson)
    }
    const fetchDistrictGeojson = () => {
      fetch(`/geojson/districts.geojson`)
        .then((res) => res.json())
        .then(setDistrictGeojson)
    }
    fetchStateGeojson()
    fetchDistrictGeojson()
  }, [])
  if (stateGeojson.length === 0 || districtGeojson.length === 0) {
    return <h1>Loading</h1>
  } else {
    return (
      <div>
        {allCSVData}
        {/* <MapDashboard
          stateGeojson={stateGeojson}
          districtGeojson={districtGeojson}
        /> */}
      </div>
    )
  }
}

export default Elections
