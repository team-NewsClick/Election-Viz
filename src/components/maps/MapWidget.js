import { useEffect, useState } from "react"
import DeckGL from "deck.gl"
import { GeoJsonLayer } from "@deck.gl/layers"
import {
  _MapContext as MapContext,
  StaticMap,
} from "react-map-gl"
import { stateCoordinates } from "../../constants"

/**
 * Plot Map and Deckgl Layers
 * @component
 * @param {Object} param0 - Dashboard Objects (GeoJSON)
 * @return {JSX.Element} Map Widget
 */
const MapWidget = ({ stateGeojson, districtGeojson }) => {
  const [stateName, setStateName] = useState("")
  const [districtData, setDistrictData] = useState(districtGeojson)
  const [stateData, setStateData] = useState(stateGeojson)
  const [initialViewState, setInitialViewState] = useState({
    latitude: 20.7,
    longitude: 82.8,
    zoom: 4.3,
    pitch: 0,
    bearing: 0
  })

  useEffect(() => {
    setDistrictData((districtGeojson) => ({ ...districtGeojson }))
    setStateData((stateGeojson) => ({ ...stateGeojson }))
  }, [stateName])

  const _handleMapState = (object) => {
    const state = object.properties.ST_NM
    const stateObject = stateCoordinates.filter((row) => {
      if (state == row.state) {
        return row
      }
    })
    setStateName(state)
    setInitialViewState({
      ...initialViewState,
      latitude: stateObject[0].latitude,
      longitude: stateObject[0].longitude,
      zoom: 6
    })
  }

  const _drawDistrictLine = (d) => {
    if (d.properties.State === stateName) {
      return [255, 255, 0, 255]
    }
    return [0, 0, 0, 0]
  }
  const _fillStateLineColor = (d) => {
    if (stateName) {
      return [255, 255, 255, 255]
    } else {
      return [220, 220, 220, 255]
    }
  }

  const layers = [
    new GeoJsonLayer({
      id: "state-geojson-layer",
      data: stateData,
      stroked: true,
      filled: true,
      lineWidthScale: 600,
      getFillColor: [255, 255, 255, 0],
      getLineColor: (d) => _fillStateLineColor(d),
      getLineWidth: 5,
      pickable: true,
      onClick: ({ object }) => _handleMapState(object)
    }),
    new GeoJsonLayer({
      id: "district-geojson-layer",
      data: districtData,
      stroked: true,
      filled: false,
      lineWidthScale: 200,
      getFillColor: [255, 255, 255, 0],
      getLineColor: (d) => _drawDistrictLine(d),
      getLineWidth: 5,
      pickable: true
    })
  ]

  return (
    <div>
      <DeckGL
        initialViewState={initialViewState}
        pickingRadius={5}
        controller={true}
        layers={layers}
        width={window.innerWidth}
        height={window.innerWidth * 1.25}
        ContextProvider={MapContext.Provider}
      >
        <StaticMap
          reuseMaps
          mapboxApiAccessToken={process.env.MAPBOX_BOX_ACCESS_TOKEN}
          preventStyleDiffing={true}
        />
      </DeckGL>
    </div>
  )
}

export default MapWidget
