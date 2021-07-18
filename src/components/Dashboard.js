import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  ELECTION_TYPE_DEFAULT,
  GENERAL_YEAR_OPTIONS,
  ASSEMBLY_YEAR_OPTIONS,
  YEAR_OPTIONS,
  YEAR_DEFAULT_SELECT,
  REGION_OPTIONS,
  STATE_UT_DEFAULT_SELECT,
  CONSTITUENCIES_DEFAULT_SELECT,
  LOCALITY_OPTIONS,
  COMMUNITY_OPTIONS,
  GENDER_OPTIONS,
  EDUCATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  CRIMINALITY_OPTIONS,
  SEAT_TYPE_OPTIONS,
  SEAT_DEFAULT_SELECT,
  REGION_DEFAULT_SELECT,
  ELECTION_TYPE_ASSEMBLY,
  DEFAULT_GROUP_TYPE,
  COMPARE_OPTIONS
} from "../constants"
import {
  ConstituencyConstestantsStats,
  RegionStatsSVG,
  RegionStatsTable
} from "./infographics/index"
import MapWidget from "../components/maps/MapWidget"
import Loading from "./helpers/Loading"
import {
  getDataStateUT,
  getDataConstituency,
  getStateUTs,
  getConstituencies,
  getMapData,
  getConstituenciesResults
} from "../helpers/utils"
import { getRegionStatsSVGData, getResultsByPolling } from "../helpers/statsSVG"
import { getRegionStatsTable } from "../helpers/statsTable"
import { getReservedGeoJson } from "../helpers/reservedSeats"
import { getRegions } from "../helpers/regions"
import CustomAllianceModal from "./modals/CustomAllianceModal"
import SwingsModal from "./modals/SwingsModal"
import { calculateSwings } from "../helpers/swings"

/**
 * Controls/Settings for the visualization of infographics
 */
const Dashboard = ({
  stateGeojson,
  parliamentaryConstituenciesGeojson,
  assemblyConstituenciesGeojson
}) => {
  const windowWidth = window.innerWidth
  const [electionType, setElectionType] = useState(ELECTION_TYPE_ASSEMBLY)
  const [yearOptions, setYearOptions] = useState(ASSEMBLY_YEAR_OPTIONS)
  const [compareElection, setCompareElection] = useState(COMPARE_OPTIONS[0].value)
  const [selectedYear, setSelectedYear] = useState(yearOptions[0])
  const [selectedYearData, setSelectedYearData] = useState([])
  const [selectedStateUT, setSelectedStateUT] = useState(STATE_UT_DEFAULT_SELECT)
  const [selectedConstituency, setSelectedConstituency] = useState(CONSTITUENCIES_DEFAULT_SELECT)
  const [selectedStateUTData, setSelectedStateUTData] = useState([])
  const [selectedConstituencyData, setSelectedConstituencyData] = useState([])
  const [mapData, setMapData] = useState({})
  const [seatType, setSeatType] = useState(SEAT_DEFAULT_SELECT)
  const [regionStatsSVGData, setRegionStatsSVGData] = useState()
  const [regionStatsTableData, setRegionStatsTableData] = useState([])
  const [groupType, setGroupType] = useState(DEFAULT_GROUP_TYPE)
  const [partyAlliance, setPartyAlliance] = useState()
  const [constituenciesResults, setConstituenciesResults] = useState([])
  const [mapWidgetLoading, setMapWidgetLoading] = useState(true)
  const [regionStatsLoading, setRegionStatsLoading] = useState(true)
  const [compareYearData, setCompareYearData] = useState([])
  const [filteredGeoJSON, setFilteredGeoJSON] = useState({})
  const [stateUTOptions, setStateUTOptions] = useState([])
  const [constituencyOptions, setConstituencyOptions] = useState([])
  const [regionOptions, setRegionOptions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(REGION_DEFAULT_SELECT)
  const [swingParams, setSwingParams] = useState([])
  const [partiesSwing, setPartiesSwing] = useState([])

  useEffect(() => {
    setYearOptions(
      electionType == "general" ? GENERAL_YEAR_OPTIONS : ASSEMBLY_YEAR_OPTIONS
    )
    setSelectedYear(
      yearOptions.indexOf(selectedYear) > -1 ? selectedYear : yearOptions[0]
    )
  }, [electionType, yearOptions])

  useEffect(() => {
    axios
      .get(`/data/csv/${electionType}_${selectedYear}.csv`)
      .then((response) => {
        const parsedData = csvParse(response.data)
        setSelectedYearData(parsedData)
      })
  }, [selectedYear])

  useEffect(() => {
    const comapreWith = compareElection.split("-")
    const compareYear = comapreWith[0]
    const compareElectionType = comapreWith[1]
    if(compareElectionType === electionType && compareYear === selectedYear) {
      setCompareYearData([])
    } else if(electionType === compareElectionType && compareYear !== selectedYear) {
      axios
        .get(`/data/csv/${compareElectionType}_${parseInt(compareYear)}.csv`)
        .then((response) => {
          const parsedData = csvParse(response.data)
          setCompareYearData(parsedData)
        })
        .catch((e) => setCompareYearData([]))
    } else {
      axios
        .get(`/data/csv/${compareElectionType}_${parseInt(compareYear)}.csv`)
        .then((response) => {
          const parsedData = csvParse(response.data)
          const tempCompareYearData = getResultsByPolling(parsedData, compareElectionType,stateUTOptions)
          setCompareYearData(tempCompareYearData)
        })
        .catch((e) => setCompareYearData([]))
    }
  }, [compareElection])

  useEffect(() => {
    setStateUTOptions(
      getStateUTs(selectedYearData, electionType, filteredGeoJSON)
    )
  }, [selectedYearData, electionType, seatType, filteredGeoJSON])

  useEffect(() => {
    setConstituencyOptions(
      getConstituencies(
        selectedStateUTData,
        selectedStateUT,
        electionType,
        filteredGeoJSON
      )
    )
  }, [
    selectedStateUTData,
    selectedStateUT,
    electionType,
    seatType,
    stateUTOptions,
    filteredGeoJSON
  ])

  useEffect(() => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
    stateUTOptions.length > 0 &&
      setSelectedStateUT(
        stateUTOptions.indexOf(selectedStateUT) > -1
          ? selectedStateUT
          : stateUTOptions[0]
      )
  }, [
    selectedStateUTData,
    yearOptions,
    selectedYearData,
    seatType,
    filteredGeoJSON,
    stateUTOptions
  ])

  useEffect(() => {
    setSelectedConstituency(
      constituencyOptions.indexOf(selectedConstituency) > -1
        ? selectedConstituency
        : constituencyOptions[0]
    )
  }, [
    selectedYearData,
    selectedStateUTData,
    yearOptions,
    constituencyOptions,
    seatType,
    filteredGeoJSON
  ])

  useEffect(() => {
    setSelectedRegion(
      regionOptions.indexOf(selectedRegion) > -1
        ? selectedRegion
        : REGION_DEFAULT_SELECT
    )
  }, [
    yearOptions,
    selectedYear,
    stateUTOptions,
    selectedStateUT,
    constituencyOptions,
    selectedConstituency,
    filteredGeoJSON
  ])

  useEffect(() => {
    if (selectedYearData != []) {
      setMapData(getMapData(selectedYearData, selectedStateUT, electionType))
    }
  }, [
    selectedYearData,
    selectedStateUT,
    seatType,
    filteredGeoJSON,
    stateUTOptions,
    constituencyOptions,
    selectedRegion
  ])

  useEffect(() => {
    if (electionType === "general") {
      setFilteredGeoJSON(
        getReservedGeoJson(
          parliamentaryConstituenciesGeojson,
          seatType,
          selectedStateUT,
          selectedRegion
        )
      )
    } else {
      setFilteredGeoJSON(
        getReservedGeoJson(
          assemblyConstituenciesGeojson,
          seatType,
          selectedStateUT,
          selectedRegion
        )
      )
    }
  }, [seatType, electionType, selectedRegion, selectedStateUT])

  useEffect(() => {
    setConstituenciesResults(
      getConstituenciesResults(
        mapData,
        selectedConstituency,
        electionType,
        groupType,
        partyAlliance
      )
    )
  }, [
    mapData,
    selectedConstituency,
    selectedStateUT,
    electionType,
    groupType,
    selectedYear,
    partyAlliance,
    selectedRegion
  ])

  useEffect(() => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
  }, [
    electionType,
    selectedStateUT,
    selectedYear,
    selectedConstituency,
    selectedYear
  ])

  useEffect(() => {
    if (electionType === "general") {
      setRegionStatsSVGData(
        getRegionStatsSVGData(
          constituenciesResults,
          electionType,
          groupType,
          partyAlliance,
          selectedStateUT,
          filteredGeoJSON
        )
      )
    } else {
      setRegionStatsSVGData(
        getRegionStatsSVGData(
          selectedStateUT === STATE_UT_DEFAULT_SELECT
            ? selectedYearData
            : selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
            ? selectedStateUTData
            : selectedConstituencyData,
          electionType,
          groupType,
          partyAlliance,
          selectedStateUT,
          filteredGeoJSON
        )
      )
    }
    setMapWidgetLoading(false)
    setRegionStatsLoading(false)
  }, [constituenciesResults, filteredGeoJSON])

  useEffect(() => {
    setRegionStatsTableData(
      getRegionStatsTable(
        selectedStateUT === STATE_UT_DEFAULT_SELECT
          ? selectedYearData
          : selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
          ? selectedStateUTData
          : mapData.constituencies,
        regionStatsSVGData,
        electionType,
        groupType,
        partyAlliance,
        selectedStateUT,
        selectedConstituency,
        compareYearData,
        mapData.constituencies,
        filteredGeoJSON
      )
    )
  }, [regionStatsSVGData])

  useEffect(() => {
    setRegionOptions(getRegions(selectedStateUT))
  }, [selectedStateUT])

  useEffect(() => {
    const result = []
    if (partyAlliance && swingParams && swingParams.length !== 0) {
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
      partyAlliance &&
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
  }, [swingParams, partyAlliance])

  useEffect(() => {
    const temp = getDataStateUT(selectedYearData, selectedStateUT)
    setSelectedStateUTData([...temp])
  }, [selectedYearData, selectedStateUT])

  useEffect(() => {
    if (electionType === "assembly") {
      axios
        .get(`/data/csv/${electionType}_${selectedYear}.csv`)
        .then((response) => {
          const parsedData = csvParse(response.data)
          if(selectedStateUT === STATE_UT_DEFAULT_SELECT) {
            setSelectedYearData(parsedData)
          } else {
            const temp = calculateSwings(
              parsedData,
              selectedStateUT,
              constituencyOptions,
              partiesSwing
            )
            setSelectedYearData([...temp])
          }
        })
    }
  }, [partiesSwing])

  useEffect(() => {
    const temp = getDataConstituency(
      selectedStateUTData,
      selectedConstituency,
      electionType
    )
    setSelectedConstituencyData(temp)
  }, [selectedStateUTData, selectedConstituency])

  const showHideAdvanceOptions = () => {
    const options = document.getElementById("advanceOptionsWeb")
    const btnText = document.getElementById("showHideAdvance-btn")
    const btnIcon = document.getElementById("showHideAdvance-btn-icon")
    options.style.display === "none"
      ? ((options.style.display = "block"),
        (btnText.innerHTML = "Hide Advance Options"),
        (btnIcon.style.transform = "rotate(180deg)"))
      : ((options.style.display = "none"),
        (btnText.innerHTML = "Show Advance Options"),
        (btnIcon.style.transform = "rotate(0deg)"))
  }

  const _home = () => {
    if (selectedStateUT !== STATE_UT_DEFAULT_SELECT) {
      setMapWidgetLoading(true)
      setSelectedStateUT(STATE_UT_DEFAULT_SELECT)
      setSeatType(SEAT_DEFAULT_SELECT)
      setSelectedRegion(REGION_DEFAULT_SELECT)
      setSeatType(SEAT_DEFAULT_SELECT)
    }
    const option = document.getElementById("advanceOptionsWeb")
    const btnText = document.getElementById("showHideAdvance-btn")
    const btnIcon = document.getElementById("showHideAdvance-btn-icon")
    option.style.display = "none"
    btnText.innerHTML = "Show Advance Options"
    btnIcon.style.transform = "rotate(0deg)"
  }

  const openCustomAllianceModal = () => {
    const customAllianceModal = document.getElementById("customAllianceModal")
    customAllianceModal.style.display === "none"
      ? (customAllianceModal.style.display = "flex")
      : (customAllianceModal.style.display = "none")
  }

  const openSwingModal = () => {
    const swingModal = document.getElementById("swingModal")
    swingModal.style.display === "none"
      ? (swingModal.style.display = "flex")
      : (swingModal.style.display = "none")
  }
  const customAlliance = (customAlliance) => {
    setPartyAlliance(customAlliance)
  }
  const handleSwingParams = (params) => {
    setSwingParams(params)
  }
  const _handleElectionType = (v) => {
    setElectionType(v)
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
  }
  const _handleCompareElection = (v) => {
    setCompareElection(v)
  }
  const _updatedRegion = (state) => {
    setSelectedStateUT(state)
  }
  const _handleSelectedYear = (v) => {
    setSelectedYear(v)
  }
  const _handleCompareYear = (v) => {
    setCompareYear(v)
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
  const _handleSelectedLocality = (v) => {
    console.log(v)
  }
  const _handleSelectedConstituency = (v) => {
    setSelectedConstituency(v)
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
  const _handleSelectedSeatType = (v) => {
    setSeatType(v)
  }

  if (selectedYearData.length !== 0) {
    return (
      <div>
        <div className="h-10" />
        <div className="flex flex-wrap justify-center mx-auto">
          <div className="radio-toolbar md:mx-2 my-2">
            <input
              type="radio"
              id="general"
              name="election"
              value="general"
              onChange={(e) => _handleElectionType(e.currentTarget.value)}
            />
            <label htmlFor="general">General Elections</label>
            <input
              type="radio"
              id="assembly"
              name="election"
              value="assembly"
              defaultChecked
              onChange={(e) => _handleElectionType(e.currentTarget.value)}
            />
            <label htmlFor="assembly">Assembly Elections</label>
          </div>
          <div className="radio-toolbar md:mx-2 my-2">
            <input
              type="radio"
              id="alliance"
              name="group"
              value="alliance"
              onChange={(e) => _handleGroupType(e.currentTarget.value)}
            />
            <label htmlFor="alliance">Alliance</label>
            <input
              type="radio"
              id="party"
              name="group"
              value="party"
              defaultChecked
              onChange={(e) => _handleGroupType(e.currentTarget.value)}
            />
            <label htmlFor="party">Party</label>
          </div>
          <div>
            <select
              name="year"
              onChange={(e) => _handleSelectedYear(e.target.value)}
              id="year"
              className="w-40 md:w-64"
              value={selectedYear}
            >
              {yearOptions.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap justify-center mx-auto">
          <div>
            <select
              name="state-ut"
              onChange={(e) => _handleSelectedStateUT(e.target.value)}
              id="state-ut"
              className="advance-select w-40 md:w-64"
              value={selectedStateUT}
            >
              {stateUTOptions.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="constituency"
              onChange={(e) => _handleSelectedConstituency(e.target.value)}
              id="constituency"
              className="advance-select w-40 md:w-64"
              value={selectedConstituency}
            >
              {constituencyOptions.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div
            onClick={showHideAdvanceOptions}
            className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm"
          >
            <div id="showHideAdvance-btn" className="my-auto mx-3">
              Show Advance Options
            </div>
            <div>
              <img
                id="showHideAdvance-btn-icon"
                src="../img/down-arrow.svg"
                alt="Show Advance Options"
                className="w-3 h-3 md:ml-14 m-1.5"
              />
            </div>
          </div>
        </div>
        <div
          id="advanceOptionsWeb"
          style={{ display: "none", zIndex: "2" }}
          className="bg-gray-100 h-full md:h-auto md:relative inset-0 top-0 md:top-auto fixed"
        >
          <div className="h-0.5 bg-gray-300 w-full max-w-4xl my-3.5 mx-auto hidden md:block">
            &nbsp;
          </div>
          <div className="flex justify-center my-8 md:hidden">
            <div className="font-bold">Advance Options</div>
            <div
              className="absolute top-8 right-6 cursor-pointer"
              onClick={showHideAdvanceOptions}
            >
              <img
                id="showHideAdvance-btn-icon"
                src="../img/close-btn.svg"
                alt="Close Button"
                className="w-4 h-4"
              />
            </div>
          </div>
          <div className="mx-auto max-w-4xl justify-center">
            <div>
              <div className="flex flex-wrap mx-auto justify-around md:justify-center">
                <div>
                  <select
                    name="region"
                    onChange={(e) => _handleSelectedRegion(e.target.value)}
                    id="region"
                    className="advance-select md:w-64"
                    value={selectedRegion}
                  >
                    {regionOptions.map((d, index) => (
                      <option key={index} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    name="seatType"
                    onChange={(e) => _handleSelectedSeatType(e.target.value)}
                    id="seatType"
                    className="advance-select md:w-64"
                    value={seatType}
                  >
                    {SEAT_TYPE_OPTIONS.map((d, index) => (
                      <option key={index} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap mx-auto justify-around md:justify-center">
                <div
                  onClick={openCustomAllianceModal}
                  className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                  >
                  Customise Alliances
                </div>
                {selectedStateUT !== STATE_UT_DEFAULT_SELECT && (
                  <div
                    onClick={openSwingModal}
                    className="max-w-sm justify-center flex cursor-pointer w-42 md:w-64 bg-gray-800 text-white rounded border border-gray-500 h-7 m-2 text-sm items-center"
                  >
                    Add Swings
                  </div>
                )}
              </div>
              <div className="flex flex-wrap mx-auto justify-around md:justify-center">
                  <div className="md:w-64 inline-block align-text-bottom my-auto">
                  Select an election to compare:
                  </div>
                  <div>
                    <select
                      name="compareElection"
                      onChange={(e) => _handleCompareElection(e.target.value)}
                      id="compareElection"
                      className="advance-select md:w-64"
                      value={compareElection}
                    >
                      {COMPARE_OPTIONS.map((d, index) => (
                        <option key={index} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
              </div>
              {/* <div>
                <select
                  name="locality"
                  onChange={(e) => _handleSelectedLocality(e.target.value)}
                  id="locality"
                  className="advance-select"
                >
                  {LOCALITY_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="community"
                  onChange={(e) => _handleSelectedCommunity(e.target.value)}
                  id="community"
                  className="advance-select"
                >
                  {COMMUNITY_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="gender"
                  onChange={(e) => _handleSelectedGender(e.target.value)}
                  id="gender"
                  className="advance-select"
                >
                  {GENDER_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="education"
                  onChange={(e) => _handleSelectedEducation(e.target.value)}
                  id="education"
                  className="advance-select"
                >
                  {CRIMINALITY_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="experience"
                  onChange={(e) => _handleSelectedExperience(e.target.value)}
                  id="experience"
                  className="advance-select"
                >
                  {EXPERIENCE_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="criminality"
                  onChange={(e) => _handleSelectedCriminality(e.target.value)}
                  id="criminality"
                  className="advance-select"
                >
                  {EDUCATION_OPTIONS.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
            <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between md:hidden">
              <div>
                <input
                  type="button"
                  value="RESET"
                  className="black-btn"
                  onClick={_home}
                />
              </div>
              <div>
                <input
                  type="button"
                  value="OK"
                  onClick={showHideAdvanceOptions}
                  className="black-btn"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          id="customAllianceModal"
          style={{ display: "none", zIndex: "2" }}
          className="fixed left-0 top-0 bottom-0 overflow-y-scroll"
        >
          <CustomAllianceModal
            constituenciesResults={constituenciesResults}
            customAlliance={customAlliance}
            swingParams={swingParams}
            selectedYear={selectedYear}
            selectedStateUT={selectedStateUT}
          />
        </div>
        <div
          id="swingModal"
          className="fixed left-0 top-0 bottom-0 overflow-y-scroll"
          style={{ display: "none", zIndex: "2" }}
        >
          <SwingsModal
            selectedYear={selectedYear}
            handleSwingParams={handleSwingParams}
            selectedStateUT={selectedStateUT}
            partyAlliance={partyAlliance}
          />
        </div>
        <div className="lg:flex lg:flex-row-reverse relative py-8">
          <div
            className={windowWidth > 800 ? "" : "widthImp100 heightImp100"}
            style={windowWidth < 800 ? {} : { width: windowWidth * 0.28 }}
            className="bg-gray-50 rounded border border-gray-300 py-0.5 lg:pt-8 px-2 lg:ml-2.5 mb-4"
          >
            {electionType === "assembly" &&
            selectedStateUT === STATE_UT_DEFAULT_SELECT ? (
              <div className="flex h-full">
                <div className="text-center m-auto text-xl px-4">
                  Please select a region from the drop-down or by clicking on
                  the map.
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
                    left: "-29px",
                    width: "29px",
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
                  parliamentaryConstituenciesGeojson={
                    parliamentaryConstituenciesGeojson
                  }
                  assemblyConstituenciesGeojson={assemblyConstituenciesGeojson}
                  onMapUpdate={_updatedRegion}
                  electionType={electionType}
                  stateUTOptions={stateUTOptions}
                  selectedStateUT={selectedStateUT}
                  selectedConstituency={selectedConstituency}
                  mapData={mapData}
                  constituenciesResults={constituenciesResults}
                  mapWidgetLoading={mapWidgetLoading}
                  seatType={seatType}
                  selectedRegion={selectedRegion}
                />
              </div>
            )}
          </div>
        </div>
        {/* {constituencyContestantsStatsData !== null && (
          <ConstituencyConstestantsStats
            constituencyContestantsStatsData={constituencyContestantsStatsData}
          />
        )} */}
      </div>
    )
  } else {
    return (
      <div
        // className="min-h-screen my-auto"
        style={{ minHeight: screen.height, height: "100%", margin: "auto" }}
      >
        <Loading />
      </div>
    )
  }
}

export default Dashboard
