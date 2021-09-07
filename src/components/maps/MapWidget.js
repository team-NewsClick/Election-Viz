import { useEffect, useState } from "react"
import DeckGL from "deck.gl"
import { GeoJsonLayer } from "@deck.gl/layers"
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl
} from "react-map-gl"
import {
  STATE_COORDINATES,
  ALL_STATE_UT,
  DEFAULT_DISTRICT_FILL_COLOR,
  DEFAULT_STATE_LINE_COLOR,
  DEFAULT_DISTRICT_LINE_COLOR,
  TRANSPARENT_COLOR,
  ALL_CONSTITUENCIES,
  SELECT_STATE_UT
} from "../../constants"
import { indPlaceVal, getInitalStateUTcolors } from "../../helpers/utils"
import hexRgb from "hex-rgb"
import Loading from "../helpers/Loading"
import { getFilteredGeoJson } from "../../helpers/reservedSeats"

/**
 * Plot Map and Deckgl Layers
 * @component
 * @param {Object} param0 - Dashboard Objects (GeoJSON)
 * @return {JSX.Element} Map Widget
 */
const MapWidget = ({
  stateGeojson,
  constituenciesGeojson,
  onMapUpdate,
  electionViewType,
  stateUTOptions,
  selectedStateUT,
  selectedConstituency,
  mapData,
  constituenciesResults,
  mapWidgetLoading,
  seatType,
  selectedRegion,
  selectedElection
}) => {
  const windowWidth = window.innerWidth
  const [stateName, setStateName] = useState("")
  const [initialstateColors, setInitialStateColors] = useState([])
  const [layers, setLayers] = useState([])
  const [filterdGeoJsonData, setFilterdGeoJsonData] = useState(
    constituenciesGeojson
  )
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
    const tempInitialStateColors = getInitalStateUTcolors(
      stateUTOptions,
      selectedElection
    )
    if (tempInitialStateColors) {
      const stateColors = tempInitialStateColors.filter((d) => d !== undefined)
      setInitialStateColors(stateColors)
    }
  }, [stateUTOptions])

  useEffect(() => {
    const filterdGeoJson = getFilteredGeoJson(
      constituenciesGeojson,
      seatType,
      stateUTOptions,
      selectedStateUT,
      selectedRegion
    )
    setFilterdGeoJsonData(() => ({ ...filterdGeoJson }))
    setStateData(() => ({ ...stateGeojson }))
  }, [stateName, constituenciesResults, seatType, selectedRegion])

  useEffect(() => {
    const state = selectedStateUT
    if (state !== ALL_STATE_UT && state !== SELECT_STATE_UT) {
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
          zoom: windowWidth < 800 ? stateObject[0].zoom * 0.82 : stateObject[0].zoom
        })
      }
    } else {
      setStateName(state)
      setInitialViewState(
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
    }
  }, [selectedStateUT, electionViewType, constituenciesResults])

  useEffect(() => {
  let tempLayers = []
  if (
    selectedElection.type === "assembly" &&
    selectedStateUT === SELECT_STATE_UT
  ) {
    tempLayers = [
      new GeoJsonLayer({
        id: "state-geojson-layer-1",
        data: stateData,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 600,
        getLineWidth: 4,
        getLineColor: DEFAULT_STATE_LINE_COLOR,
        getFillColor: (d) => _fillInitGeoJsonColor(d),
        onClick: ({ object }) => _handleMap(object)
      })
    ]
  } else {
    tempLayers = [
      new GeoJsonLayer({
        id: "constituency-geojson-layer-1",
        data: filterdGeoJsonData,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 200,
        getFillColor: (d) => _fillGeoJsonColor(d),
        getLineColor: DEFAULT_DISTRICT_LINE_COLOR,
        getLineWidth: electionViewType === "general" ? 10 : 2,
        onClick: ({ object }) => _handleMap(object)
      }),
      new GeoJsonLayer({
        id: "state-geojson-layer-2",
        data: stateData,
        stroked: true,
        filled: false,
        lineWidthScale: 600,
        getLineColor: DEFAULT_STATE_LINE_COLOR,
        getFillColor: TRANSPARENT_COLOR,
        getLineWidth: 4
      })
    ]
  }
  setLayers(tempLayers)
  }, [constituenciesResults, filterdGeoJsonData])

  const _handleMap = (object) => {
    const state = object.properties.ST_NAME
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
      zoom: windowWidth < 800 ? stateObject[0].zoom * 0.82 : stateObject[0].zoom
    })
    onMapUpdate(state)
  }

  const _fillGeoJsonColor = (d) => {
    let results = null, sortByStateKey = null, sortByConstituencyKey = null
    sortByStateKey = d.properties.ST_NAME
    sortByConstituencyKey = electionViewType === "general"
      ? d.properties.PC_NO
      : d.properties.AC_NO
    results = constituenciesResults[sortByStateKey] && constituenciesResults[sortByStateKey][sortByConstituencyKey]
    if (results) {
      const hexColor = hexRgb(results.color)
      return [hexColor.red, hexColor.green, hexColor.blue, hexColor.alpha*255]
    } else {
      return DEFAULT_DISTRICT_FILL_COLOR
    }
  }

  const _fillInitGeoJsonColor = (d) => {
    const sortByKey = d.properties.ST_NAME
    const results = initialstateColors.find((row) => {
      if (row.state === sortByKey) {
        return row
      }
    })
    if(results) {
      const hexColor = hexRgb(results.color)
      return [hexColor.red, hexColor.green, hexColor.blue, hexColor.alpha*255]
    } else {
      return DEFAULT_DISTRICT_FILL_COLOR
    }
  }

  const _getTooltip = ({ object }) => {
    if (object && Object.keys(mapData).length !== 0) {
      let results = null, sortByStateKey = null, sortByConstituencyKey = null
      if (electionViewType === "general") {
        if (
          selectedConstituency == object.properties.PC_NO ||
          selectedConstituency === ALL_CONSTITUENCIES ||
          selectedStateUT === ALL_STATE_UT
        ) {
          sortByStateKey = object.properties.ST_NAME
          sortByConstituencyKey = object.properties.PC_NO
          results = mapData[sortByStateKey][sortByConstituencyKey]
          let voteShare = ""
          results &&
            results.map((d) => {
              voteShare =
                voteShare +
                `<div><b>${d.party}</b>: ${indPlaceVal(d.votesReceived)}</div>`
            })
          if (results) {
          }
          return (
            results && {
              html: `
              <div>
                <div class="pb-1">State: <b>${object.properties.ST_NAME}</b></div>
                <div class="pb-1">
                  <div>Constituency: <b>${object.properties.PC_NAME}</b></div>
                  <div>Winner: <b>${results[0].candidate}</b></div>
                </div>
                <div>
                  <div>Vote Share:</div>
                  <div>
                  ${voteShare}
                  </div>
                </div>
              </div>
              `
            }
          )
        }
      } else {
        if (
          selectedConstituency == object.properties.AC_NO ||
          selectedConstituency === ALL_CONSTITUENCIES ||
          selectedStateUT === ALL_STATE_UT
        ) {
          sortByStateKey = object.properties.ST_NAME
          sortByConstituencyKey = object.properties.AC_NO
          results = mapData[sortByStateKey][sortByConstituencyKey]
          let voteShare = ""
          results &&
            results.map((d) => {
              voteShare =
                voteShare +
                `<div><b>${d.party}</b>: ${indPlaceVal(d.votesReceived)}</div>`
            })
          return (
            results && {
              html: `
              <div>
                <div class="pb-1">State: <b>${object.properties.ST_NAME}</b></div>
                <div class="pb-1">
                  <div>Constituency: <b>${object.properties.AC_NAME}</b></div>
                  <div>Winner: <b>${results[0].candidate}</b></div>
                </div>
                <div>Vote Share:</div>
                    <div>
                    ${voteShare}
                    </div>
                  </div>
              </div>
              `
            }
          )
        }
      }
    }
  }

  const _getCursor = (e) => {
    return e.isHovering ? (e.isDragging ? "grabbing" : "pointer") : ""
  }

  return (
    <div>
      <DeckGL
        initialViewState={initialViewState}
        pickingRadius={5}
        controller={true}
        getTooltip={_getTooltip}
        layers={layers}
        getCursor={(e) => _getCursor(e)}
        width={
          windowWidth < 800
            ? windowWidth > 700
              ? windowWidth * 0.67
              : windowWidth * 0.9
            : windowWidth * 0.42
        }
        height={
          windowWidth < 800
            ? windowWidth > 700
              ? windowWidth * 0.8
              : windowWidth * 1.15
            : windowWidth * 0.44
        }
        ContextProvider={MapContext.Provider}
      >
        <div style={{ position: "absolute", right: 30, top: 0, zIndex: 1 }}>
          <NavigationControl />
        </div>
        {mapWidgetLoading === true ? (
          <div className="h-full">
            <div className=" w-full h-full bg-gray-200 opacity-70"></div>
            <div className="absolute" style={{ top: "50%", left: "50%" }}>
              <Loading />
            </div>
          </div>
        ) : (
          <StaticMap
            reuseMaps
            mapboxApiAccessToken={process.env.MAPBOX_BOX_ACCESS_TOKEN}
            preventStyleDiffing={true}
          />
        )}
      </DeckGL>
    </div>
  )
}

export default MapWidget
