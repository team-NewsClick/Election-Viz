import { getJsonData } from "../lib/loadCSV"
import { useEffect, useState } from "react"
// import MapDashboard from "../components/maps/MapDashboard"

/**
 * Generate Static Props
 * @return {Array.<Object>} Array of JSON Objects
 */
export async function getStaticProps() {
  const allJsonData = await getJsonData()
  return {
    props: {
      allJsonData
    }
  }
}

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = ({ allJsonData }) => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [districtGeojson, setDistrictGeojson] = useState([])

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
        {console.log("Inside Page Function: ", allJsonData)}
        {/* <MapDashboard
          stateGeojson={stateGeojson}
          districtGeojson={districtGeojson}
        /> */}
      </div>
    )
  }
}

export default Elections
