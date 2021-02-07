import { useEffect, useState } from "react"
import MapDashboard from "../components/maps/MapDashboard"

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = () => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [districtGeojson, setDistrictGeojson] = useState([])

  useEffect(() => {
    const fetchStateGeojson = () => {
      fetch(`/data/states.geojson`)
        .then((res) => res.json())
        .then(setStateGeojson)
    }
    const fetchDistrictGeojson = () => {
      fetch(`/data/districts.geojson`)
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
        <MapDashboard
          stateGeojson={stateGeojson}
          districtGeojson={districtGeojson}
        />
      </div>
    )
  }
}

export default Elections
