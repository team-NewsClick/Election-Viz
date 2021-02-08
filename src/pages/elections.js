import { useEffect, useState } from "react"
import { csvParse } from 'd3-dsv'
import MapDashboard from "../components/maps/MapDashboard"
import TableWidget from "../components/table/TableWidget"

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = () => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [districtGeojson, setDistrictGeojson] = useState([])
  const [assemblyData, setAssemblyData] = useState([])

  useEffect(() => {
    const fetchStateGeojson = () => {
      fetch(`/data/geojson/states.geojson`)
        .then((res) => res.json())
        .then(setStateGeojson)
    }
    const fetchDistrictGeojson = () => {
      fetch(`/data/geojson/districts.geojson`)
        .then((res) => res.json())
        .then(setDistrictGeojson)
    }
    const fetchTableCsvData = () => {
      fetch(`/data/csv/assembly_2014.csv`)
        .then((res) => res.text())
        .then(csvParse)
        .then(setAssemblyData)
    }
    fetchStateGeojson()
    fetchDistrictGeojson()
    fetchTableCsvData()
  }, [])
  if (stateGeojson.length === 0 || districtGeojson.length === 0 || assemblyData.length === 0) {
    return <h1>Loading</h1>
  } else {
    return (
      <div>
        <TableWidget assemblyData={assemblyData} />
        <MapDashboard
          stateGeojson={stateGeojson}
          districtGeojson={districtGeojson}
        />
      </div>
    )
  }
}

export default Elections
