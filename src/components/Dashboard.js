import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  ELECTION_VIEW_TYPE_DEFAULT,
  STATE_UT_DEFAULT_SELECT,
  CONSTITUENCIES_DEFAULT_SELECT,
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
  FIRST_SELECT_STATEUT
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
  getMapData,
  getConstituenciesResults,
  getYearOptions,
  getCompareOptions
} from "../helpers/utils"
import { getRegionStatsSVGData } from "../helpers/statsSVG"
import { getRegionStatsTable } from "../helpers/statsTable"
import { getReservedGeoJson } from "../helpers/reservedSeats"
import { getRegions } from "../helpers/regions"
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

  useEffect(() => {
    if(selectedElection !== FIRST_SELECT_STATEUT){
      setMapWidgetLoading(true)
    }
    setRegionStatsLoading(true)
  }, [
    electionViewType,
    selectedStateUT,
    selectedConstituency,
    groupType,
    selectedElection,
    compareElection,
    selectedRegion,
    seatType,
    partyAlliance,
    swingParams,
    partiesSwing
  ])

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

  const customAlliance = (customAlliance) => {
    setPartyAlliance(customAlliance)
  }
  const handleSwingParams = (params) => {
    setSwingParams(params)
  }
  const _handleElectionViewType = (v) => {
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
  const _handleSelectedSeatType = (v) => {
    setSeatType(v)
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

  if (stateUTOptions && stateUTOptions.length !== 0) {
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
          customAlliance={customAlliance}
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
        />
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
        style={{ minHeight: screen.height, height: "100%", margin: "auto" }}
      >
        <Loading />
      </div>
    )
  }
}

export default Dashboard
