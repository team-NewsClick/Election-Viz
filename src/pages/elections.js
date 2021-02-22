// import { getJsonData } from "../lib/loadCSV"
import { useEffect, useState } from "react"
import { csvParse } from "d3-dsv"

// import MapDashboard from "../components/maps/MapDashboard"

/**
 * Generate Static Props
 * @return {Array.<Object>} Array of JSON Objects
 */
// export async function getStaticProps() {
//   const allJsonData = await getJsonData()
//   return {
//     props: {
//       allJsonData
//     }
//   }
// }

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
// const Elections = ({ allJsonData }) => {
const Elections = () => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [districtGeojson, setDistrictGeojson] = useState([])
  const [selectedYear, setSelectedYear] = useState("2019")
  const [yearByData, setYearByData] = useState([])
  const [allData, setAllData] = useState([])

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

  useEffect(() => {
    const fetchYear = () => {
      fetch(`/data/csv/assembly_${selectedYear}.csv`)
        .then((res) => res.text())
        .then(csvParse)
        .then(setYearByData)
        .then(
          setAllData([...allData, { year: selectedYear, data: yearByData }])
        )
        .then(setYearByData([]))
      // setAllData((allData) => [...allData, yearByData])
    }
    fetchYear()
    console.log("YearByData: ", yearByData)
    console.log("All Data: ", allData)
  }, [selectedYear])

  const _handleYear = (e) => {
    setSelectedYear(e.currentTarget.value)
  }

  if (stateGeojson.length === 0 || districtGeojson.length === 0) {
    return <h1>Loading</h1>
  } else {
    return (
      <div>
        <div className="flex justify-center">
          <div className="radio-toolbar m-2">
            <input
              type="radio"
              id="2014"
              name="year"
              value="2014"
              onChange={(e) => _handleYear(e)}
            />
            <label htmlFor="2014">2014</label>
            <input
              type="radio"
              id="2016"
              name="year"
              value="2016"
              onChange={(e) => _handleYear(e)}
            />
            <label htmlFor="2016">2016</label>
            <input
              type="radio"
              id="2015"
              name="year"
              value="2015"
              onChange={(e) => _handleYear(e)}
            />
            <label htmlFor="2015">2015</label>
            <input
              type="radio"
              id="2019"
              name="year"
              value="2019"
              defaultChecked
              onChange={(e) => _handleYear(e)}
            />
            <label htmlFor="2019">2019</label>
          </div>
        </div>
        {/* <MapDashboard
          stateGeojson={stateGeojson}
          districtGeojson={districtGeojson}
        /> */}
      </div>
    )
  }
}

export default Elections
