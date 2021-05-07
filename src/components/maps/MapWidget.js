import { useEffect, useState } from "react"
import ReactDOMServer from 'react-dom/server';
import DeckGL from "deck.gl"
import { GeoJsonLayer } from "@deck.gl/layers"
import {
  _MapContext as MapContext,
  StaticMap,
  NavigationControl
} from "react-map-gl"
import {
  STATE_COORDINATES,
  STATE_UT_DEFAULT_SELECT,
  DEFAULT_STATE_FILL_COLOR,
  DEFAULT_DISTRICT_FILL_COLOR,
  DEFAULT_STATE_LINE_COLOR,
  DEFAULT_DISTRICT_LINE_COLOR,
  TRANSPARENT_COLOR,
  CONSTITUENCIES_DEFAULT_SELECT
} from "../../constants"
import { indPlaceVal } from "../../utils"
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
  parliamentaryConstituenciesGeojson,
  assemblyConstituenciesGeojson,
  onMapUpdate,
  electionType,
  selectedStateUT,
  selectedConstituency,
  stateUTMapDataPC,
  constituenciesResults,
  topSix,
  mapWidgetLoading
}) => {
  const windowWidth = window.innerWidth
  const [stateName, setStateName] = useState("")
  const [districtData, setDistrictData] = useState(
    parliamentaryConstituenciesGeojson
  )
  const [assemblyData, setAssemblyData] = useState(
    assemblyConstituenciesGeojson
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
    setDistrictData((parliamentaryConstituenciesGeojson) => ({
      ...parliamentaryConstituenciesGeojson
    }))
    setAssemblyData((assemblyConstituenciesGeojson) => ({
      ...assemblyConstituenciesGeojson
    }))
    setStateData((stateGeojson) => ({ ...stateGeojson }))
  }, [stateName, constituenciesResults])

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
          zoom: electionType === "general" ? 5 : 7
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
  }, [selectedStateUT, electionType, constituenciesResults])

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
      zoom: electionType === "general" ? 5 : 7
    })
    onMapUpdate(state)
  }

  const _fillGeoJsonColor = (d) => {
    let results = null
    let sortByKey = null
    if (electionType === "general") {
      sortByKey = d.properties.PC_NAME
      results = constituenciesResults.find((row) => {
        if (
          (sortByKey == row.pc_name &&
            selectedStateUT === d.properties.ST_NAME) ||
          (sortByKey == row.pc_name &&
            selectedStateUT === STATE_UT_DEFAULT_SELECT)
        ) {
          return row
        }
      })
    } else {
      sortByKey = d.properties.AC_NAME
      results = constituenciesResults.find((row) => {
        if (sortByKey == row.ac_name) {
          return row
        }
      })
    }
    if (results) {
      const hexColor = hexRgb(results.color)
      return [hexColor.red, hexColor.green, hexColor.blue]
    } else {
      return DEFAULT_DISTRICT_FILL_COLOR
    }
  }

  const _getTooltip = ({ object }) => {
    if (object) {
      if (electionType === "general") {
        if (
          selectedConstituency === object.properties.PC_NAME ||
          selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT ||
          selectedStateUT === STATE_UT_DEFAULT_SELECT
        ) {
          const sortByKey = object.properties.PC_NAME
          const results = stateUTMapDataPC.constituencies.find((row) => {
            if (sortByKey == row.PC_NAME) {
              return row
            }
          })
          let voteShare = ""
          results && (
            results.stats.map((d) => {
              voteShare = voteShare + `<div><b>${d.party}</b>: ${indPlaceVal(
                d.votesReceived
              )}</div>`
            })
          )
          if(results){
          }
          return (
            results && {
              html: `
              <div>
                <div class="pb-1">State: <b>${
                  object.properties.ST_NAME
                }</b></div>
                <div class="pb-1">
                  <div>Constituency: <b>${results.PC_NAME}</b></div>
                  <div>Winner: <b>${results.stats[0].candidate}</b></div>
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
        const sortByKey = object.properties.AC_NAME
        const results = stateUTMapDataPC.constituencies.find((row) => {
          if (sortByKey == row.AC_NAME) {
            return row
          }
        })
        let voteShare = ""
        results && (
          results.stats.map((d) => {
            voteShare = voteShare + `<div><b>${d.party}</b>: ${indPlaceVal(
              d.votesReceived
            )}</div>`
          })
        )
        return (
          results && {
            html: `
            <div>
              <div class="pb-1">State: <b>${object.properties.ST_NAME}</b></div>
              <div class="pb-1">
                <div>Constituency: <b>${results.AC_NAME}</b></div>
                <div>Winner: <b>${results.stats[0].candidate}</b></div>
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
  let layers = []
  if (electionType === "general") {
    layers = [
      new GeoJsonLayer({
        id: "parlimantary-constituency-geojson-layer-1",
        data: districtData,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 200,
        getFillColor: (d) => _fillGeoJsonColor(d),
        getLineColor: DEFAULT_DISTRICT_LINE_COLOR,
        getLineWidth: 10,
        onClick: ({ object }) => _handleMap(object)
      })
    ]
  } else {
    layers = [
      new GeoJsonLayer({
        id: "assembly-constituency-geojson-layer-1",
        data: assemblyData,
        stroked: true,
        filled: true,
        pickable: true,
        lineWidthScale: 200,
        getFillColor: (d) => _fillGeoJsonColor(d),
        getLineColor: DEFAULT_DISTRICT_LINE_COLOR,
        getLineWidth: 2,
        onClick: ({ object }) => _handleMap(object)
      })
    ]
  }

  layers.push(
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
  )

  const _getCursor = (e) => {
    return e.isHovering ? e.isDragging ? "grabbing" : "pointer" : ""
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
