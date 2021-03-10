import { useEffect, useState } from "react"
import DeckGL from "deck.gl"
import { GeoJsonLayer } from "@deck.gl/layers"
import { _MapContext as MapContext, StaticMap } from "react-map-gl"
import { stateCoordinates, stateUTDefaultSelect } from "../../constants"
import { RegionSummary } from "../infographics/index"

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
  selectedStateUT
}) => {
  const windowWidth = window.innerWidth
  const [stateName, setStateName] = useState('')
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
            bearing: 0,
          }
        : {
            latitude: 23,
            longitude: 82.5,
            zoom: 3,
            pitch: 0,
            bearing: 0,
          }
      : {
          latitude: 23,
          longitude: 83,
          zoom: 4,
          pitch: 0,
          bearing: 0,
        }
  )

  useEffect(() => {
    setDistrictData((districtGeojson) => ({ ...districtGeojson }))
    setStateData((stateGeojson) => ({ ...stateGeojson }))
  }, [stateName])

  useEffect(() => {
    const state = selectedStateUT
    if (state !== stateUTDefaultSelect) {
      const stateObject = stateCoordinates.filter((row) => {
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
      zoom: 6,
    })
    onMapUpdate(state)
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
      id: 'state-geojson-layer',
      data: stateData,
      stroked: true,
      filled: true,
      lineWidthScale: 600,
      getFillColor: [255, 255, 255, 0],
      getLineColor: (d) => _fillStateLineColor(d),
      getLineWidth: 5,
      pickable: true,
      onClick: ({ object }) => _handleMapState(object),
    }),
    new GeoJsonLayer({
      id: 'district-geojson-layer',
      data: districtData,
      stroked: true,
      filled: false,
      lineWidthScale: 200,
      getFillColor: [255, 255, 255, 0],
      getLineColor: (d) => _drawDistrictLine(d),
      getLineWidth: 5,
      pickable: true,
    }),
  ]

  return (
    <div className="lg:flex lg:flex-row-reverse relative">
      <div
        className={windowWidth > 800 ? '' : 'widthImp100'}
        style={windowWidth < 800 ? {} : { width: windowWidth * 0.28 }}
        className="lg:ml-2 mb-4 w-full"
      >
        <RegionStats />
      </div>
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
