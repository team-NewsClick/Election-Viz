import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  ELECTION_VIEW_TYPE_DEFAULT,
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
  ELECTION_VIEW_TYPE_ASSEMBLY,
  DEFAULT_GROUP_TYPE,
  LIVE_ELECTION,
  LIVE_ELECTION_YEAR,
  DELAY_INTERVAL_MINUTES,
  FIRST_SELECT_STATEUT
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
  getStateUTs,
  getConstituencies,
  getMapData,
  getConstituenciesResults,
  getYearOptions,
  getCompareOptions
} from "../helpers/utils"
import { getRegionStatsSVGData } from "../helpers/statsSVG"
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
  const [electionViewType, SetElectionViewType] = useState(ELECTION_VIEW_TYPE_ASSEMBLY)
  const [selectedElection, setSelectedElection] = useState(FIRST_SELECT_STATEUT)
  const [electionOptions, setElectionOptions] = useState([FIRST_SELECT_STATEUT])
  const [compareElection, setCompareElection] = useState()
  const [selectedYearData, setSelectedYearData] = useState([])
  const [selectedStateUT, setSelectedStateUT] = useState(STATE_UT_DEFAULT_SELECT)
  const [selectedConstituency, setSelectedConstituency] = useState(CONSTITUENCIES_DEFAULT_SELECT)
  const [selectedStateUTData, setSelectedStateUTData] = useState([])
  const [mapData, setMapData] = useState({})
  const [seatType, setSeatType] = useState(SEAT_DEFAULT_SELECT)
  const [regionStatsSVGData, setRegionStatsSVGData] = useState({})
  const [regionStatsTableData, setRegionStatsTableData] = useState([])
  const [groupType, setGroupType] = useState(DEFAULT_GROUP_TYPE)
  const [partyAlliance, setPartyAlliance] = useState()
  const [constituenciesResults, setConstituenciesResults] = useState([])
  const [mapWidgetLoading, setMapWidgetLoading] = useState(true)
  const [regionStatsLoading, setRegionStatsLoading] = useState(true)
  const [compareYearData, setCompareYearData] = useState([])
  const [compareOptions, setCompareOptions] = useState([])
  const [filteredGeoJSON, setFilteredGeoJSON] = useState({})
  const [stateUTOptions, setStateUTOptions] = useState([])
  const [constituencyOptions, setConstituencyOptions] = useState([])
  const [regionOptions, setRegionOptions] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(REGION_DEFAULT_SELECT)
  const [swingParams, setSwingParams] = useState([])
  const [partiesSwing, setPartiesSwing] = useState([])

  useEffect(() => {
    axios.get(`/data/csv/party_alliance.csv`).then((response) => {
      const parsedData = csvParse(response.data)
      setPartyAlliance(parsedData)
    })
  }, [selectedElection, selectedStateUT])

  useEffect(() => {
    if(electionViewType === "general") {
      const tempElectionOptions = getYearOptions(electionViewType, selectedStateUT)
      setElectionOptions(tempElectionOptions)
    }
    if(electionViewType === "assembly") {
      const tempStateUTOptions = getStateUTs(selectedElection, seatType, electionViewType, assemblyConstituenciesGeojson)
      const tempElectionOptions = getYearOptions(electionViewType, selectedStateUT)
      setStateUTOptions(tempStateUTOptions)
      setElectionOptions(tempElectionOptions)
    }
  }, [electionViewType])

  useEffect(() => {
    if(electionViewType === "assembly") {
      const temp = getYearOptions(electionViewType, selectedStateUT)
      setElectionOptions(temp)
    }
  }, [selectedStateUT])

  useEffect(() => {
    if(electionOptions[0].value !== FIRST_SELECT_STATEUT) {
      const temp = electionOptions.indexOf(selectedElection) > -1
        ? selectedElection
        : {type: electionOptions[0].value.type, year: (electionOptions[0].value.year).toString()}
      setSelectedElection(temp)
    } else {
      const temp = electionOptions.indexOf(selectedElection) > -1
        ? selectedElection
        : electionOptions[0].value
      setSelectedElection(temp)
    }
  }, [electionOptions])

  useEffect(() => {
    if(electionViewType === "general") {
      setStateUTOptions(
        getStateUTs(selectedElection, seatType, electionViewType, parliamentaryConstituenciesGeojson)
      )
    }
  }, [selectedElection, seatType])

  useEffect(() => {
    if(electionViewType === "general") {
      setMapWidgetLoading(true)
      setRegionStatsLoading(true)
      stateUTOptions.length > 0 &&
        setSelectedStateUT(
          stateUTOptions.indexOf(selectedStateUT) > -1
            ? selectedStateUT
            : stateUTOptions[0]
        )
    }
  }, [
    selectedYearData,
    seatType,
    filteredGeoJSON,
    stateUTOptions
  ])

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
    if(compareOptions.length !== 0) {
      const electionType = selectedElection.type
      const year = selectedElection.year
      let URL, COMPARE_URL, COMPARE_ELECTION
      if(selectedElection === LIVE_ELECTION) {
        URL = `${process.env.LIVE_ELECTION}`
        COMPARE_URL = `/data/csv/${electionType}_${parseInt(LIVE_ELECTION_YEAR) - 5}.csv`
        COMPARE_ELECTION = {type: electionType, year: parseInt(LIVE_ELECTION_YEAR) -5}
      } else {
        URL = `/data/csv/${electionType}_${year}.csv`
        COMPARE_URL = `/data/csv/${electionType}_${parseInt(year) - 5}.csv`
        COMPARE_ELECTION = {type: electionType, year: (parseInt(year) -5).toString()}
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
  }, [selectedElection])

  useEffect(() => {
    setRegionStatsLoading(true)
    if (compareElection) {
      const electionType = selectedElection.type
      const year = selectedElection.year
      const compareElectionType = compareElection.type
      const compareYear = compareElection.year
      if (
        compareElectionType === electionType &&
        compareYear === year
      ) {
        setCompareYearData([])
      } else {
        axios
          .get(`/data/csv/${compareElectionType}_${parseInt(compareYear)}.csv`)
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
    setSelectedConstituency(
      constituencyOptions.indexOf(selectedConstituency) > -1
        ? selectedConstituency
        : constituencyOptions[0]
    )
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
    if (selectedYearData != []) {
      setMapData(getMapData(selectedYearData, selectedStateUT, electionViewType))
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
    if (electionViewType === "general") {
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
  }, [seatType, electionViewType, selectedRegion, selectedStateUT])

  useEffect(() => {
    if(mapData.length !== 0) {
      setConstituenciesResults(
        getConstituenciesResults(
          mapData,
          selectedConstituency,
          electionViewType,
          groupType,
          partyAlliance
        )
      )
    }
  }, [
    mapData,
    selectedConstituency,
    selectedStateUT,
    electionViewType,
    groupType,
    selectedElection,
    partyAlliance,
    selectedRegion
  ])

  useEffect(() => {
    setMapWidgetLoading(true)
    setRegionStatsLoading(true)
  }, [
    electionViewType,
    selectedStateUT,
    selectedElection,
    selectedConstituency
  ])

  useEffect(() => {
    if(constituenciesResults.length !== 0) {
      const temp = getRegionStatsSVGData(
        constituenciesResults,
        electionViewType,
        groupType,
        selectedStateUT,
        filteredGeoJSON
      )
      setRegionStatsSVGData(temp)
    }
    setMapWidgetLoading(false)
    setRegionStatsLoading(false)
  }, [constituenciesResults, filteredGeoJSON])

  useEffect(() => {
    if (compareElection) {
      setRegionStatsTableData(
        getRegionStatsTable(
          selectedStateUT === STATE_UT_DEFAULT_SELECT
            ? selectedYearData
            : selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
            ? selectedStateUTData
            : mapData.constituencies,
          compareYearData,
          regionStatsSVGData,
          electionViewType,
          compareElection,
          groupType,
          partyAlliance,
          selectedStateUT,
          selectedConstituency,
          mapData.constituencies,
          filteredGeoJSON
        )
      )
      setRegionStatsLoading(false)
    }
  }, [regionStatsSVGData, compareYearData])

  useEffect(() => {
    setRegionOptions(getRegions(selectedStateUT))
  }, [selectedStateUT])

  useEffect(() => {
    let result = []
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
    if(partiesSwing.length !== 0) {
      if (selectedElection !== LIVE_ELECTION) {
        axios
          .get(`/data/csv/${electionType}_${year}.csv`)
          .then((response) => {
            const parsedData = csvParse(response.data)
            if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
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
          .catch((e) => {
             setSelectedYearData([])
          })
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
    setSelectedRegion(REGION_DEFAULT_SELECT)
    setSeatType(SEAT_DEFAULT_SELECT)
    SetElectionViewType(v)
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

  if (stateUTOptions && stateUTOptions.length !== 0) {
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
            <label htmlFor="general">General</label>
            <input
              type="radio"
              id="assembly"
              name="election"
              value="assembly"
              defaultChecked
              onChange={(e) => _handleElectionType(e.currentTarget.value)}
            />
            <label htmlFor="assembly">Assembly</label>
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
        </div>
        <div className="flex flex-wrap justify-center mx-auto">
          <div>
            <select
              name="year"
              onChange={(e) => _handleSelectedElection(e.target.value)}
              id="year"
              className="w-40 md:w-64"
              value={JSON.stringify(selectedElection)}
            >
              {electionOptions.map((d, index) => (
                <option key={index} value={JSON.stringify(d.value)}>
                  {d.label}
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
                    value={JSON.stringify(compareElection)}
                  >
                    {compareOptions.map((d, index) => (
                      <option key={index} value={JSON.stringify(d.value)}>
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
            selectedElection={selectedElection}
            selectedStateUT={selectedStateUT}
            constituencyOptions={constituencyOptions}
            electionViewType={electionViewType}
            customAlliance={customAlliance}
          />
        </div>
        <div
          id="swingModal"
          className="fixed left-0 top-0 bottom-0 overflow-y-scroll"
          style={{ display: "none", zIndex: "2" }}
        >
          <SwingsModal
            selectedElection={selectedElection}
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
            {electionViewType === "assembly" &&
            selectedStateUT === STATE_UT_DEFAULT_SELECT ? (
              <div className="flex h-full">
                <div className="text-center m-auto text-xl px-4 py-10">
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
                  electionViewType={electionViewType}
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
