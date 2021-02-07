import MapWidget from "./MapWidget"

/**
 * Plot Map
 * @component
 * @param {Object} param0 - Dashboard Objects (GeoJSON)
 * @return {JSX.Element} Map Dashboard
 */
const MapDashboard = ({ stateGeojson, districtGeojson }) => {
  return (
    <MapWidget
      stateGeojson={stateGeojson}
      districtGeojson={districtGeojson}
    />
  )
}

export default MapDashboard
