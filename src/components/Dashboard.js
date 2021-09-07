import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  ALL_STATE_UT,
  ALL_CONSTITUENCIES,
  LOCALITY_OPTIONS,
  COMMUNITY_OPTIONS,
  GENDER_OPTIONS,
  EDUCATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  CRIMINALITY_OPTIONS,
  SEAT_DEFAULT_SELECT,
  REGION_DEFAULT_SELECT,
  ELECTION_VIEW_TYPE_ASSEMBLY,
  DEFAULT_GROUP_TYPE,
  LIVE_ELECTION,
  LIVE_ELECTION_YEAR,
  DELAY_INTERVAL_MINUTES,
  FIRST_SELECT_STATEUT,
  SELECT_STATE_UT,
  SELECT_ELECTION,
  SEAT_TYPE_OPTIONS,
  LIVE_ELECTION_TYPE,
  ELECTION_DEFAULT_SELECT,
  NO_CONSTITUENCIES,
  UPCOMING_ELECTION_YEAR,
  UPCOMING_ELECTION,
  UPCOMING_ELECTION_TYPE,
  CSV_PATH
} from "../constants"
import {
  ConstituencyConstestantsStats,
  RegionStatsSVG,
  RegionStatsTable
} from "./infographics/index"
import MapWidget from "../components/maps/MapWidget"
import DashboardOptions from "./DashboardOptions"
import Loading from "./helpers/Loading"
import {
  getDataStateUT,
  getStateUTs,
  getConstituencies,
  getElectionOptions,
  getCompareOptions
} from "../helpers/utils"
import { getMapData, getConstituenciesResults } from "../helpers/mapData"
import { getRegionStatsSVGData } from "../helpers/statsSVG"
import { getRegionStatsTable } from "../helpers/statsTable"
import { getFilteredGeoJson } from "../helpers/reservedSeats"
import { getRegions } from "../helpers/regions"
import { calculateSwings } from "../helpers/swings"

/**
 * Controls/Settings for the visualization of infographics
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
    [{ name: NO_CONSTITUENCIES, code: NO_CONSTITUENCIES }]
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
  }, [selectedYearData, selectedStateUTData])

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
    }
    if (electionViewType === "assembly") {
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
        axios.get(`${process.env.LIVE_ELECTION}`).then((response) => {
          const parsedData = csvParse(response.data)
          setSelectedYearData(parsedData)
        })
      }, 1000 * 60 * DELAY_INTERVAL_MINUTES)
      return () => clearInterval(interval)
    }
  })
  useEffect(() => {
    if (compareOptions.length !== 0) {
      const electionType = selectedElection.type
      const year = selectedElection.year
      let URL, COMPARE_URL, COMPARE_ELECTION
      if (year === LIVE_ELECTION_YEAR) {
        URL = `${process.env.LIVE_ELECTION}`
        COMPARE_URL = `${CSV_PATH}/${LIVE_ELECTION_TYPE}_${
          parseInt(LIVE_ELECTION_YEAR) - 5
        }.csv`
        COMPARE_ELECTION = {
          type: LIVE_ELECTION_TYPE,
          year: parseInt(LIVE_ELECTION_YEAR) - 5
        }
      }
      if (year === UPCOMING_ELECTION) {
        URL = `${CSV_PATH}/${UPCOMING_ELECTION_TYPE}_${parseInt(
          UPCOMING_ELECTION_YEAR
        )}.csv`
        COMPARE_URL = `${CSV_PATH}/${UPCOMING_ELECTION_TYPE}_${
          parseInt(UPCOMING_ELECTION_YEAR) - 5
        }.csv`
        COMPARE_ELECTION = {
          type: UPCOMING_ELECTION_TYPE,
          year: parseInt(UPCOMING_ELECTION_YEAR) - 5
        }
      } else {
        URL = `${CSV_PATH}/${electionType}_${year}.csv`
        COMPARE_URL = `${CSV_PATH}/${electionType}_${parseInt(year) - 5}.csv`
        COMPARE_ELECTION = {
          type: electionType,
          year: (parseInt(year) - 5).toString()
        }
      }
      axios
        .get(URL)
        .then((response) => {
          const parsedData = csvParse(response.data)
          setSelectedYearData(parsedData)
        })
        .catch((e) => setSelectedYearData([]))
      axios
        .get(COMPARE_URL)
        .then((response) => {
          setCompareElection(COMPARE_ELECTION)
        })
        .catch((e) => setCompareElection(compareOptions[0].value))
    }
  }, [compareOptions, selectedElection])

  useEffect(() => {
    if (compareElection) {
      const electionType = selectedElection.type
      const year = selectedElection.year
      const compareElectionType = compareElection.type
      const compareYear = compareElection.year
      if (compareElectionType === electionType && compareYear === year) {
        setCompareYearData([])
      } else {
        axios
          .get(
            `${CSV_PATH}/${compareElectionType}_${parseInt(compareYear)}.csv`
          )
          .then((response) => {
            const parsedData = csvParse(response.data)
            setCompareYearData(parsedData)
          })
          .catch((e) => setCompareYearData([]))
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
      selectedYearData != [] &&
      Object.keys(colorPartyAlliance).length !== 0
    ) {
      setMapData(
        getMapData(
          selectedYearData,
          stateUTOptions,
          electionViewType,
          colorPartyAlliance
        )
      )
    } else {
      setMapData({})
    }
  }, [selectedYearData, colorPartyAlliance])

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
    if (Object.keys(mapData).length !== 0) {
      setConstituenciesResults(
        getConstituenciesResults(
          mapData,
          selectedStateUT,
          selectedConstituency,
          electionViewType,
          groupType,
          partyAlliance,
          colorPartyAlliance
        )
      )
    } else {
      setConstituenciesResults({})
    }
    setMapWidgetLoading(false)
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
      if (
        selectedConstituency !== FIRST_SELECT_STATEUT &&
        selectedConstituency !== NO_CONSTITUENCIES
      ) {
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
    } else {
      setRegionStatsTableData([])
    }
    setRegionStatsLoading(false)
    setMapWidgetLoading(false)
  }, [regionStatsSVGData, compareYearData, partiesSwing])

  useEffect(() => {
    setRegionOptions(getRegions(selectedStateUT))
  }, [selectedStateUT])

  useEffect(() => {
    let result = []
    if (partyAlliance && swingParams && swingParams.length !== 0) {
      if (swingParams && swingParams.length === 0) {
        partyAlliance.map((d) => {
          result.push({
            PARTY: d.PARTY,
            ALLIANCE: d.ALLIANCE,
            swing: 0,
            newParty: false
          })
        })
      } else {
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
      if (selectedElection !== LIVE_ELECTION) {
        axios
          .get(`${CSV_PATH}/${electionType}_${year}.csv`)
          .then((response) => {
            const parsedData = csvParse(response.data)
            if (selectedStateUT === ALL_STATE_UT) {
              setSelectedYearData(parsedData)
            } else {
              const temp = calculateSwings(
                parsedData,
                selectedStateUT,
                constituencyOptions,
                partiesSwing,
                electionViewType
              )
              setSelectedYearData([...temp])
            }
          })
          .catch((e) => setSelectedYearData([]))
      } else {
        axios.get(`${process.env.LIVE_ELECTION}`).then((response) => {
          const parsedData = csvParse(response.data)
          setSelectedYearData(parsedData)
        })
      }
    }
  }, [partiesSwing])

  useEffect(() => {
    const temp = getCompareOptions(selectedElection, selectedStateUT)
    setCompareOptions(temp)
  }, [selectedStateUT, electionViewType, selectedElection])

  useEffect(() => {
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
  }, [advanceReset])

  useEffect(() => {
    if (electionViewType === "assembly")
      setGetAssemblyStateElectionOptions(true)
  }, [electionViewType, selectedElection, selectedStateUT])

  const _home = () => {
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

  const doAdvanceReset = () => {
    setAdvanceReset(!advanceReset)
  }
  const customAlliance = (customAlliance) => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
    setPartyAlliance(customAlliance)
  }
  const handleColorPartyAlliance = (params) => {
    setColorPartyAlliance(params)
  }
  const handleSwingParams = (params) => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
    setSwingParams(params)
  }
  const _handleElectionViewType = (v) => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
    SetElectionViewType(v)
    if (electionViewType === "assembly") {
      setGetAssemblyStateElectionOptions(false)
    }
  }
  const _handleCompareElection = (v) => {
    setRegionStatsLoading(true)
    setCompareElection(JSON.parse(v))
  }
  const _updatedRegion = (state) => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
    setSelectedStateUT(state)
  }
  const _handleSelectedElection = (v) => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
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
  const _handleSelectedLocality = (v) => {
    console.log(v)
  }
  const _handleSelectedCommunity = (v) => {
    console.log(v)
  }
  const _handleSelectedGender = (v) => {
    console.log(v)
  }
  const _handleSelectedEducation = (v) => {
    console.log(v)
  }
  const _handleSelectedExperience = (v) => {
    console.log(v)
  }
  const _handleSelectedCriminality = (v) => {
    console.log(v)
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
        homeReset={_home}
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
        groupType={groupType}
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
              selectedStateUT === ALL_STATE_UT) &&
            (selectedElection === SELECT_ELECTION ||
              selectedElection === FIRST_SELECT_STATEUT) && (
              <div className="flex h-full">
                <div className="text-center m-auto text-xl px-4 py-10">
                  Please select a region from the drop-down or by clicking on
                  the map.
                </div>
              </div>
            )}
          {electionViewType === "assembly" &&
            (selectedStateUT !== (SELECT_STATE_UT || ALL_STATE_UT) ||
              selectedElection !== (SELECT_ELECTION || FIRST_SELECT_STATEUT)) &&
            selectedStateUTData.length === 0 &&
            Object.keys(regionStatsSVGData).length === 0 && (
              <div className="flex h-full">
                <div className="text-center m-auto text-xl px-4 py-10">
                  Data for selected options does not exist.
                </div>
              </div>
            )}
          {selectedStateUT !== SELECT_STATE_UT &&
            selectedElection !== SELECT_ELECTION &&
            selectedStateUTData.length !== 0 &&
            Object.keys(regionStatsSVGData).length !== 0 && (
              <div>
                <RegionStatsSVG
                  regionStatsSVGData={regionStatsSVGData}
                  selectedConstituency={selectedConstituency}
                  regionStatsLoading={regionStatsLoading}
                />
                <RegionStatsTable
                  regionStatsTableData={regionStatsTableData}
                  regionStatsLoading={regionStatsLoading}
                />
              </div>
            )}
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
          <img src="img/map-home-icon.svg" className="w-3/5" />
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
