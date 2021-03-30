import { useEffect, useState } from "react"
import DeckGL from "deck.gl"
import { GeoJsonLayer } from "@deck.gl/layers"
import { _MapContext as MapContext, StaticMap } from "react-map-gl"
import {
  STATE_COORDINATES,
  STATE_UT_DEFAULT_SELECT,
  DEFAULT_STATE_FILL_COLOR,
  DEFAULT_DISTRICT_FILL_COLOR,
  DEFAULT_STATE_LINE_COLOR,
  DEFAULT_DISTRICT_LINE_COLOR
} from "../../constants"
import hexRgb from "hex-rgb"
import Loading from "../Loading"

/**
 * Plot Map and Deckgl Layers
 * @component
 * @param {Object} param0 - Dashboard Objects (GeoJSON)
 * @return {JSX.Element} Map Widget
 */
const MapWidget = ({
  stateGeojson,
  districtGeojson,
  onMapUpdate,
  selectedStateUT,
  StateUTMapDataPC,
  constituencyResults
}) => {
  const windowWidth = window.innerWidth
  const [stateName, setStateName] = useState("")
  const [districtData, setDistrictData] = useState(districtGeojson)
  const [stateData, setStateData] = useState(stateGeojson)
  const [initialViewState, setInitialViewState] = useState(
    windowWidth < 800
      ? windowWidth > 700
        ? {
            latitude: 23,
            longitude: 83,
            zoom: 3.6,
            pitch: 0,
            bearing: 0
          }
        : {
            latitude: 23,
            longitude: 82.5,
            zoom: 3,
            pitch: 0,
            bearing: 0
          }
      : {
          latitude: 23,
          longitude: 83,
          zoom: 4,
          pitch: 0,
          bearing: 0
        }
  )

  useEffect(() => {
    setDistrictData((districtGeojson) => ({ ...districtGeojson }))
    setStateData((stateGeojson) => ({ ...stateGeojson }))
  }, [stateName])

  useEffect(() => {
    const state = selectedStateUT
    if (state !== STATE_UT_DEFAULT_SELECT) {
      const stateObject = STATE_COORDINATES.filter((row) => {
        if (state == row.state) {
          return row
        }
      })
      if (stateObject.length !== 0) {
        setStateName(state)
        setInitialViewState({
          ...initialViewState,
          latitude: stateObject[0].latitude,
          longitude: stateObject[0].longitude,
          zoom: 6
        })
      }
    }
  }, [selectedStateUT])

  const _handleMapState = (object) => {
    const state = object.properties.ST_NM
    const stateObject = STATE_COORDINATES.filter((row) => {
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
    onMapUpdate(state)
  }

  const _fillParliamentColor = (d) => {
    const sortByKey = d.properties.PC_NAME
    const results = constituencyResults.find((row) => {
      if (sortByKey == row.pc_name) {
        return row
      }
    })
    if (results) {
      const hexColor = hexRgb(results.color)
      return [hexColor.red, hexColor.green, hexColor.blue]
    } else {
      return DEFAULT_DISTRICT_FILL_COLOR
    }
  }

  const _fillStateLineColor = () => {
    if (stateName) {
      return DEFAULT_STATE_LINE_COLOR
    } else {
      return [220, 220, 220, 255]
    }
  }

  const layers = [
    new GeoJsonLayer({
      id: "district-geojson-layer",
      data: districtData,
      stroked: true,
      filled: true,
      lineWidthScale: 200,
      getFillColor: (d) => _fillParliamentColor(d),
      getLineColor: DEFAULT_DISTRICT_LINE_COLOR,
      getLineWidth: 10,
      pickable: true
    }),
    new GeoJsonLayer({
      id: "state-geojson-layer",
      data: stateData,
      stroked: true,
      filled: false,
      lineWidthScale: 600,
      getFillColor: DEFAULT_STATE_FILL_COLOR,
      getLineColor: DEFAULT_STATE_LINE_COLOR,
      getLineWidth: 2.5,
      pickable: true,
      onClick: ({ object }) => _handleMapState(object)
    })
  ]

  
  return (
    <div>
      <DeckGL
        initialViewState={initialViewState}
        pickingRadius={5}
        controller={true}
        layers={layers}
        width={
          windowWidth < 800
            ? windowWidth > 700
              ? windowWidth * 0.67
              : windowWidth * 0.9
            : windowWidth * 0.38
        }
        height={
          windowWidth < 800
            ? windowWidth > 700
              ? windowWidth * 0.8
              : windowWidth * 1.15
            : windowWidth * 0.42
        }
        ContextProvider={MapContext.Provider}
      >
        {
          constituencyResults.length === 0 ? <div className="h-full" >
          <Loading />
          </div> :
        <StaticMap
          reuseMaps
          mapboxApiAccessToken={process.env.MAPBOX_BOX_ACCESS_TOKEN}
          preventStyleDiffing={true}
        />
          }
      </DeckGL>
    </div>
  )
}

export default MapWidget
