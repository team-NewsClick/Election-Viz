import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import DashboardOptions from "./DashboardOptions"
import { RegionStatsSVG, RegionStatsTable } from "./infographics/index"
import MapWidget from "../components/maps/MapWidget"
import { getMapData, getConstituenciesResults } from "../helpers/mapData"
import { getRegionStatsSVGData } from "../helpers/statsSVG"
import { getRegionStatsTable } from "../helpers/statsTable"
import { getFilteredGeoJson } from "../helpers/reservedSeats"
import { getRegions } from "../helpers/regions"
import { calculateSwings } from "../helpers/swings"
import {
  ALL_STATE_UT,
  ALL_CONSTITUENCIES,
  SEAT_DEFAULT_SELECT,
  REGION_DEFAULT_SELECT,
  ELECTION_VIEW_TYPE_ASSEMBLY,
  DEFAULT_GROUP_TYPE,
  LIVE_ELECTION,
  DELAY_INTERVAL_MINUTES,
  FIRST_SELECT_STATEUT,
  SELECT_STATE_UT,
  SELECT_ELECTION,
  ELECTION_DEFAULT_SELECT,
  NO_CONSTITUENCIES,
  UPCOMING_ELECTION_YEAR,
  UPCOMING_ELECTION,
  UPCOMING_ELECTION_TYPE,
  ELECTION_YEAR_STATEUT,
  CSV_PATH
} from "../constants"
import {
  getDataStateUT,
  getStateUTs,
  getConstituencies,
  getElectionOptions,
  getCompareOptions,
  getElectionURL
} from "../helpers/utils"

/**
 * Election Dashboard
 * @component
 * @param {GeoJSON} stateGeojson
 * @param {GeoJSON} assemblyConstituenciesGeojson
 * @param {GeoJSON} parliamentaryConstituenciesGeojson
 * @returns {JSX.Element} Election Dashboard
 */
const Dashboard = ({
  stateGeojson,
  assemblyConstituenciesGeojson,
  parliamentaryConstituenciesGeojson
}) => {
  const windowWidth = window.innerWidth
  const [electionViewType, SetElectionViewType] = useState(
    ELECTION_VIEW_TYPE_ASSEMBLY
  )
  const [selectedElection, setSelectedElection] = useState(
    ELECTION_DEFAULT_SELECT
  )
  const [electionOptions, setElectionOptions] = useState([SELECT_ELECTION])
  const [compareElection, setCompareElection] = useState()
  const [selectedYearData, setSelectedYearData] = useState([])
  const [selectedStateUT, setSelectedStateUT] = useState(SELECT_STATE_UT)
  const [selectedConstituency, setSelectedConstituency] =
    useState(NO_CONSTITUENCIES)
  const [selectedStateUTData, setSelectedStateUTData] = useState([])
  const [mapData, setMapData] = useState({})
  const [seatType, setSeatType] = useState(SEAT_DEFAULT_SELECT)
  const [regionStatsSVGData, setRegionStatsSVGData] = useState({})
  const [regionStatsTableData, setRegionStatsTableData] = useState([])
  const [groupType, setGroupType] = useState(DEFAULT_GROUP_TYPE)
  const [partyAlliance, setPartyAlliance] = useState([])
  const [colorPartyAlliance, setColorPartyAlliance] = useState({})
  const [constituenciesResults, setConstituenciesResults] = useState({})
  const [mapWidgetLoading, setMapWidgetLoading] = useState(true)
  const [regionStatsLoading, setRegionStatsLoading] = useState(true)
  const [compareYearData, setCompareYearData] = useState([])
  const [compareOptions, setCompareOptions] = useState([])
  const [filteredGeoJSON, setFilteredGeoJSON] = useState({})
  const [stateUTOptions, setStateUTOptions] = useState([ALL_STATE_UT])
  const [constituencyOptions, setConstituencyOptions] = useState([
    { name: NO_CONSTITUENCIES, code: NO_CONSTITUENCIES }
  ])
  const [regionOptions, setRegionOptions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(REGION_DEFAULT_SELECT)
  const [swingParams, setSwingParams] = useState([])
  const [partiesSwing, setPartiesSwing] = useState([])
  const [advanceReset, setAdvanceReset] = useState(false)
  const [getAssemblyStateElectionOptions, setGetAssemblyStateElectionOptions] =
    useState(false)

  useEffect(() => {
    setRegionStatsLoading(true)
    setMapWidgetLoading(true)
    setSelectedYearData([])
    setSelectedStateUTData([])
    setFilteredGeoJSON({})
    setMapData({})
    setConstituenciesResults({})
    setRegionStatsSVGData({})
    setRegionStatsTableData([])
    setColorPartyAlliance({})
    setPartiesSwing([])
  }, [electionViewType, selectedElection, selectedStateUT])

  useEffect(() => {
    if (electionViewType === "general") {
      const tempElectionOptions = getElectionOptions(
        electionViewType,
        selectedStateUT
      )
      setElectionOptions(tempElectionOptions)
      setSelectedElection(tempElectionOptions[0].value)
      const tempStateUTOptions = getStateUTs(
        tempElectionOptions[0].value,
        seatType,
        electionViewType,
        parliamentaryConstituenciesGeojson
      )
      setStateUTOptions(tempStateUTOptions)
      setSelectedStateUT(tempStateUTOptions[0])
      setSelectedStateUT(ALL_STATE_UT)
    } else {
      setSelectedElection(SELECT_ELECTION)
      setSelectedStateUT(SELECT_STATE_UT)
      const tempStateUTOptions = getStateUTs(
        selectedElection,
        seatType,
        electionViewType,
        assemblyConstituenciesGeojson
      )
      const tempElectionOptions = getElectionOptions(
        electionViewType,
        selectedStateUT
      )
      setStateUTOptions(tempStateUTOptions)
      setSelectedStateUT(tempStateUTOptions[0])
      setElectionOptions(tempElectionOptions)
      setSelectedElection(ELECTION_DEFAULT_SELECT)
    }
  }, [electionViewType])

  useEffect(() => {
    if (
      selectedElection.year === UPCOMING_ELECTION &&
      selectedStateUT !== SELECT_STATE_UT
    ) {
      setSelectedElection({
        type: UPCOMING_ELECTION_TYPE,
        year: UPCOMING_ELECTION_YEAR
      })
      setGetAssemblyStateElectionOptions(false)
    }
  }, [selectedStateUT])

  useEffect(() => {
    if (
      electionViewType === "assembly" &&
      selectedStateUT === SELECT_STATE_UT &&
      selectedElection === SELECT_ELECTION
    ) {
      const tempStateUTOptions = getStateUTs(
        selectedElection,
        seatType,
        electionViewType,
        assemblyConstituenciesGeojson
      )
      const tempElectionOptions = getElectionOptions(
        electionViewType,
        selectedStateUT,
        selectedElection
      )
      setStateUTOptions(tempStateUTOptions)
      setElectionOptions(tempElectionOptions)
    }
  }, [selectedElection, selectedStateUT])

  useEffect(() => {
    if (
      getAssemblyStateElectionOptions === true &&
      electionViewType === "assembly"
    ) {
      const tempElectionOptions = getElectionOptions(
        electionViewType,
        selectedStateUT
      )
      setElectionOptions(tempElectionOptions)
      const tempStateUTOptions = getStateUTs(
        selectedElection,
        seatType,
        electionViewType,
        assemblyConstituenciesGeojson
      )
      setStateUTOptions(tempStateUTOptions)
      tempStateUTOptions &&
      tempStateUTOptions.findIndex((d) => d === selectedStateUT) > -1
        ? setSelectedStateUT(selectedStateUT)
        : setSelectedStateUT(tempStateUTOptions[0])
      setGetAssemblyStateElectionOptions(false)
    }
  }, [selectedStateUT, selectedElection])

  useEffect(() => {
    if (electionViewType === "general") {
      const tempStateUTOptions = getStateUTs(
        selectedElection,
        seatType,
        electionViewType,
        parliamentaryConstituenciesGeojson
      )
      setStateUTOptions(tempStateUTOptions)
    }
  }, [selectedElection])

  useEffect(() => {
    if (electionViewType === "general") {
      setFilteredGeoJSON(
        getFilteredGeoJson(
          parliamentaryConstituenciesGeojson,
          seatType,
          stateUTOptions,
          selectedStateUT,
          selectedRegion
        )
      )
    } else {
      setFilteredGeoJSON(
        getFilteredGeoJson(
          assemblyConstituenciesGeojson,
          seatType,
          stateUTOptions,
          selectedStateUT,
          selectedRegion
        )
      )
    }
  }, [
    seatType,
    selectedElection,
    selectedRegion,
    selectedStateUT,
    stateUTOptions
  ])

  useEffect(() => {
    if (electionViewType === "general") {
      if (stateUTOptions && stateUTOptions.length !== 0) {
        setSelectedStateUT(
          stateUTOptions.indexOf(selectedStateUT) > -1
            ? selectedStateUT
            : stateUTOptions[0]
        )
      }
    }
  }, [selectedYearData, seatType, filteredGeoJSON, stateUTOptions])

  useEffect(() => {
    if (selectedElection === LIVE_ELECTION) {
      const interval = setInterval(() => {
        axios
          .get(`${process.env.LIVE_ELECTION}`)
          .then((response) => {
            const parsedData = csvParse(response.data)
            setSelectedYearData(parsedData)
          })
          .catch((e) => setSelectedYearData([]))
      }, 1000 * 60 * DELAY_INTERVAL_MINUTES)
      return () => clearInterval(interval)
    }
  })
  useEffect(() => {
    setRegionStatsLoading(true)
    if (compareOptions.length !== 0) {
      const electionType = selectedElection.type
      const year = selectedElection.year
      if (electionViewType === "assembly") {
        const filteredCompareOptions = electionOptions.filter(
          (a) => a.value.type === "assembly"
        )
        if (selectedElection.type === "assembly") {
          filteredCompareOptions.length > 1
            ? filteredCompareOptions[1].value.year == selectedElection.year
              ? setCompareElection(compareOptions[0].value)
              : setCompareElection(filteredCompareOptions[1].value)
            : setCompareElection(compareOptions[0].value)
        } else {
          filteredCompareOptions.length > 0
            ? setCompareElection(filteredCompareOptions[0].value)
            : setCompareElection(compareOptions[0].value)
        }
      } else {
        const filteredCompareOptions = electionOptions.filter(
          (a) => a.value.type === "general"
        )
        filteredCompareOptions.length > 1
          ? filteredCompareOptions[1].value.year == selectedElection.year
            ? setCompareElection(compareOptions[0].value)
            : setCompareElection(filteredCompareOptions[1].value)
          : setCompareElection(compareOptions[0].value)
      }
      if (selectedElection === SELECT_ELECTION) {
        setSelectedYearData([])
        setCompareElection(compareOptions[0].value)
      } else {
        let electionURL = getElectionURL(electionViewType, electionType, year)
        axios
          .get(electionURL)
          .then((response) => {
            const parsedData = csvParse(response.data)
            setSelectedYearData(parsedData)
          })
          .catch((e) => setSelectedYearData([]))
      }
    }
  }, [compareOptions, selectedElection])

  useEffect(() => {
    if (compareElection) {
      if (
        compareElection.year === compareOptions[0].value.year &&
        selectedYearData.length == 0
      ) {
        setCompareYearData([])
      } else {
        let compareElectionType = compareElection.type
        let compareYear = compareElection.year
        if (
          ELECTION_YEAR_STATEUT[compareElectionType] &&
          compareYear in ELECTION_YEAR_STATEUT[compareElectionType]
        ) {
          axios
            .get(
              `${CSV_PATH}/${electionViewType}/${compareElectionType}_${compareYear}.csv`
            )
            .then((response) => {
              const parsedData = csvParse(response.data)
              setCompareYearData(parsedData)
            })
            .catch((e) => setCompareYearData([]))
        } else {
          setCompareYearData([])
        }
      }
    }
  }, [compareElection])

  useEffect(() => {
    setConstituencyOptions(
      getConstituencies(
        selectedStateUTData,
        selectedStateUT,
        electionViewType,
        filteredGeoJSON
      )
    )
  }, [selectedStateUTData, filteredGeoJSON])

  useEffect(() => {
    setSelectedConstituency(constituencyOptions[0].code)
  }, [constituencyOptions])

  useEffect(() => {
    setSelectedRegion(
      regionOptions.indexOf(selectedRegion) > -1
        ? selectedRegion
        : REGION_DEFAULT_SELECT
    )
  }, [
    electionOptions,
    selectedElection,
    stateUTOptions,
    selectedStateUT,
    constituencyOptions,
    selectedConstituency,
    filteredGeoJSON
  ])

  useEffect(() => {
    if (
      selectedStateUT !== SELECT_STATE_UT &&
      Object.keys(colorPartyAlliance).length !== 0 &&
      Object.keys(partyAlliance).length !== 0
    ) {
      setMapData(
        getMapData(
          selectedYearData,
          stateUTOptions,
          electionViewType,
          partyAlliance,
          colorPartyAlliance,
          selectedElection,
          selectedStateUT,
          filteredGeoJSON
        )
      )
    } else {
      setMapData({})
    }
  }, [selectedYearData, colorPartyAlliance, filteredGeoJSON])

  useEffect(() => {
    if (
      selectedStateUT !== SELECT_STATE_UT &&
      Object.keys(colorPartyAlliance).length !== 0 &&
      Object.keys(partyAlliance).length !== 0
    ) {
      setConstituenciesResults(
        getConstituenciesResults(
          selectedYearData,
          electionViewType,
          selectedElection,
          stateUTOptions,
          selectedStateUT,
          selectedConstituency,
          groupType,
          partyAlliance,
          colorPartyAlliance,
          filteredGeoJSON
        )
      )
      setMapWidgetLoading(false)
    } else {
      setConstituenciesResults({})
    }
    if (
      selectedStateUT === SELECT_STATE_UT ||
      selectedElection === SELECT_ELECTION
    ) {
      setMapWidgetLoading(false)
    }
  }, [mapData, selectedConstituency, selectedStateUT, groupType, partyAlliance])

  useEffect(() => {
    if (Object.keys(constituenciesResults).length !== 0) {
      const temp = getRegionStatsSVGData(
        constituenciesResults,
        electionViewType,
        groupType,
        selectedStateUT,
        filteredGeoJSON
      )
      setRegionStatsSVGData(temp)
    } else {
      setRegionStatsSVGData({})
    }
  }, [constituenciesResults, filteredGeoJSON])

  useEffect(() => {
    if (
      compareElection &&
      Object.keys(regionStatsSVGData).length !== 0 &&
      constituencyOptions.find((d) => d.code === selectedConstituency) &&
      Object.keys(mapData).length !== 0
    ) {
      let constituencyMapData = []
      if (selectedConstituency !== FIRST_SELECT_STATEUT) {
        constituencyMapData = mapData[selectedStateUT][selectedConstituency]
      }
      const tempTableData = getRegionStatsTable(
        selectedStateUT === ALL_STATE_UT
          ? selectedYearData
          : selectedConstituency === ALL_CONSTITUENCIES
          ? selectedStateUTData
          : constituencyMapData,
        compareYearData,
        regionStatsSVGData,
        electionViewType,
        selectedElection,
        compareElection,
        groupType,
        partyAlliance,
        selectedStateUT,
        stateUTOptions,
        selectedConstituency,
        constituencyMapData,
        filteredGeoJSON,
        colorPartyAlliance
      )
      tempTableData && setRegionStatsTableData(tempTableData)
      setRegionStatsLoading(false)
    } else {
      setRegionStatsTableData([])
    }
  }, [regionStatsSVGData, compareYearData, partiesSwing])

  useEffect(() => {
    setRegionOptions(getRegions(selectedStateUT))
  }, [selectedStateUT])

  useEffect(() => {
    let result = []
    if (partyAlliance && swingParams) {
      if (swingParams.length !== 0) {
        partyAlliance.map((d) => {
          const tempSwing = swingParams.find((e) => e.alliance === d.ALLIANCE)
          if (tempSwing) {
            result.push({
              PARTY: d.PARTY,
              ALLIANCE: d.ALLIANCE,
              swing: tempSwing.swing,
              newParty: tempSwing.newParty
            })
          }
        })
      } else {
        partyAlliance.map((d) => {
          result.push({
            PARTY: d.PARTY,
            ALLIANCE: d.ALLIANCE,
            swing: 0,
            newParty: false
          })
        })
      }
      setPartiesSwing([...result])
    }
  }, [swingParams, partyAlliance])

  useEffect(() => {
    const temp = getDataStateUT(selectedYearData, selectedStateUT)
    setSelectedStateUTData([...temp])
  }, [selectedYearData, selectedStateUT])

  useEffect(() => {
    const electionType = selectedElection.type
    const year = selectedElection.year
    if (partiesSwing.length !== 0) {
      if (year !== LIVE_ELECTION) {
        axios
          .get(`${CSV_PATH}/${electionViewType}/${electionType}_${year}.csv`)
          .then((response) => {
            const parsedData = csvParse(response.data)
            if (selectedStateUT === ALL_STATE_UT) {
              setSelectedYearData(parsedData)
            } else {
              const temp = calculateSwings(
                parsedData,
                selectedStateUT,
                filteredGeoJSON,
                partiesSwing,
                electionViewType
              )
              setSelectedYearData([...temp])
            }
          })
          .catch((e) => setSelectedYearData([]))
      } else {
        axios
          .get(`${process.env.LIVE_ELECTION}`)
          .then((response) => {
            const parsedData = csvParse(response.data)
            setSelectedYearData(parsedData)
          })
          .catch((e) => setSelectedYearData([]))
      }
    }
  }, [partiesSwing, filteredGeoJSON])

  useEffect(() => {
    const temp = getCompareOptions(
      electionViewType,
      selectedElection,
      selectedStateUT
    )
    setCompareOptions(temp)
  }, [selectedStateUT, electionViewType, selectedElection])

  useEffect(() => {
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
  }, [advanceReset])

  useEffect(() => {
    electionViewType === "assembly" && setGetAssemblyStateElectionOptions(true)
  }, [electionViewType, selectedElection, selectedStateUT])

  const _home = () => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
    setSelectedStateUT(stateUTOptions[0])
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
    const option = document.getElementById("advanceOptionsWeb")
    const btnText = document.getElementById("showHideAdvance-btn")
    const btnIcon = document.getElementById("showHideAdvance-btn-icon")
    if (option && btnText && btnIcon) {
      option.style.display = "none"
      btnText.innerHTML = "Show Advance Options"
      btnIcon.style.transform = "rotate(0deg)"
    }
  }

  const customAlliance = (customAlliance) => {
    setPartyAlliance(customAlliance)
  }
  const handleColorPartyAlliance = (params) => {
    setColorPartyAlliance(params)
  }
  const handleSwingParams = (params) => {
    setSwingParams(params)
  }
  const _handleElectionViewType = (v) => {
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
    SetElectionViewType(v)
    if (electionViewType === "assembly") {
      setGetAssemblyStateElectionOptions(false)
    }
  }
  const _handleCompareElection = (v) => {
    setCompareElection(JSON.parse(v))
  }
  const _updatedRegion = (state) => {
    setSelectedStateUT(state)
  }
  const _handleSelectedElection = (v) => {
    setSelectedElection(JSON.parse(v))
  }
  const _handleSelectedRegion = (v) => {
    setSelectedRegion(v)
  }
  const _handleGroupType = (v) => {
    setGroupType(v)
  }
  const _handleSelectedStateUT = (v) => {
    setSelectedStateUT(v)
  }
  const _handleSelectedConstituency = (v) => {
    setSelectedConstituency(v)
  }
  const _handleSelectedSeatType = (v) => {
    setSeatType(v)
  }
  const doAdvanceReset = () => {
    setAdvanceReset(!advanceReset)
  }

  return (
    <div>
      <DashboardOptions
        updateElectionViewType={_handleElectionViewType}
        updateCompareElection={_handleCompareElection}
        updateSelectedElection={_handleSelectedElection}
        updateSelectedRegion={_handleSelectedRegion}
        updateGroupType={_handleGroupType}
        updateSelectedStateUT={_handleSelectedStateUT}
        updateSelectedConstituency={_handleSelectedConstituency}
        updateSelectedSeatType={_handleSelectedSeatType}
        doAdvanceReset={doAdvanceReset}
        customAlliance={customAlliance}
        handleColorPartyAlliance={handleColorPartyAlliance}
        handleSwingParams={handleSwingParams}
        electionOptions={electionOptions}
        stateUTOptions={stateUTOptions}
        constituencyOptions={constituencyOptions}
        regionOptions={regionOptions}
        compareOptions={compareOptions}
        electionViewType={electionViewType}
        selectedElection={selectedElection}
        selectedStateUT={selectedStateUT}
        selectedConstituency={selectedConstituency}
        selectedRegion={selectedRegion}
        seatType={seatType}
        compareElection={compareElection}
        partyAlliance={partyAlliance}
        advanceReset={advanceReset}
      />
      <div className="lg:flex lg:flex-row-reverse relative py-8">
        <div
          className={windowWidth > 800 ? "" : "widthImp100 heightImp100"}
          style={windowWidth < 800 ? {} : { width: windowWidth * 0.28 }}
          className="bg-gray-50 rounded border border-gray-300 py-0.5 lg:pt-8 px-2 lg:ml-2.5 mb-4"
        >
          {electionViewType === "assembly" &&
            (selectedStateUT === SELECT_STATE_UT ||
              selectedElection === SELECT_ELECTION) && (
              <div className="flex h-full">
                <div className="text-center m-auto text-xl px-4 py-10">
                  Please select a region from the drop-down or by clicking on
                  the map.
                </div>
              </div>
            )}
          {selectedStateUT !== SELECT_STATE_UT &&
            selectedElection !== SELECT_ELECTION &&
            (Object.keys(regionStatsSVGData).length === 0 &&
            !regionStatsLoading ? (
              <div className="flex h-full">
                <div className="text-center m-auto text-xl px-4 py-10">
                  Data for selected options does not exist.
                </div>
              </div>
            ) : (
              <div>
                <RegionStatsSVG
                  regionStatsSVGData={regionStatsSVGData}
                  selectedConstituency={selectedConstituency}
                  regionStatsLoading={regionStatsLoading}
                />
                <RegionStatsTable
                  regionStatsTableData={regionStatsTableData}
                  regionStatsLoading={regionStatsLoading}
                  selectedElection={selectedElection}
                  compareElection={compareElection}
                />
              </div>
            ))}
        </div>
        <div
          onClick={_home}
          id="maphome"
          title="Home"
          className="flex relative items-center justify-center bg-white hover:bg-gray-200 rounded cursor-pointer"
          style={
            windowWidth < 800
              ? windowWidth > 700
                ? {
                    top: "90px",
                    left: "95%",
                    width: "29px",
                    height: "29px",
                    zIndex: "1",
                    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%)"
                  }
                : {
                    top: "90px",
                    left: "90.5%",
                    width: "29px",
                    height: "29px",
                    zIndex: "1",
                    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%)"
                  }
              : {
                  top: "60px",
                  left: "-30px",
                  width: "37px",
                  height: "29px",
                  zIndex: "1",
                  boxShadow: "0 0 0 2px rgb(0 0 0 / 10%)"
                }
          }
        >
          <img src="img/home-icon.svg" alt="inital config" className="w-3/5" />
        </div>
        <div>
          {regionStatsSVGData && (
            <div>
              <MapWidget
                stateGeojson={stateGeojson}
                constituenciesGeojson={
                  electionViewType === "general"
                    ? parliamentaryConstituenciesGeojson
                    : assemblyConstituenciesGeojson
                }
                onMapUpdate={_updatedRegion}
                electionViewType={electionViewType}
                stateUTOptions={stateUTOptions}
                selectedStateUT={selectedStateUT}
                selectedConstituency={selectedConstituency}
                mapData={mapData}
                constituenciesResults={constituenciesResults}
                mapWidgetLoading={mapWidgetLoading}
                seatType={seatType}
                selectedRegion={selectedRegion}
                selectedElection={selectedElection}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
