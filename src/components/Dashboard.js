import { useState, useEffect } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import {
  yearOptions,
  yearDefaultSelect,
  regionOptions,
  stateUTDefaultSelect,
  constituenciesDefaultSelect,
  localityOptions,
  communityOptions,
  genderOptions,
  educationOptions,
  experienceOptions,
  crimianalityOptions,
  seatTypeOptions
} from "../constants"
import PartyAllianceTable from "./infographics/party-alliance-table"
import ConstituencyConstestantsStats from "./infographics/constituency-contestants-stats"
import MapWidget from "../components/maps/MapWidget"
import {
  dataStateUT,
  dataConstituency,
  getStateUTs,
  getConstituencies,
  getConstituencyContestantsStatsData
} from "../utils"

/**
 * Controls/Settings for the visualization of infographics
 */
const Dashboard = ({ stateGeojson, districtGeojson }) => {
  const [selectedYear, setSelectedYear] = useState(yearDefaultSelect)
  const [selectedYearData, setSelectedYearData] = useState([])
  const [selectedStateUT, setSelectedStateUT] = useState(stateUTDefaultSelect)
  const [selectedConstituency, setSelectedConstituency] = useState(
    constituenciesDefaultSelect
  )

  useEffect(() => {
    axios.get(`/data/csv/assembly_${selectedYear}.csv`).then((response) => {
      const parsedData = csvParse(response.data)
      setSelectedYearData(parsedData)
    })
  }, [selectedYear])

  useEffect(() => {
    setSelectedStateUT(
      stateUTOptions.indexOf(selectedStateUT) > -1
        ? selectedStateUT
        : stateUTOptions[0]
    )
    setSelectedConstituency(
      constituencyOptions.indexOf(selectedConstituency) > -1
        ? selectedConstituency
        : constituencyOptions[0]
    )
  }, [selectedYearData])

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

  const selectedStateUTData = dataStateUT(selectedYearData, selectedStateUT)
  const selectedConstituencyData = dataConstituency(
    selectedStateUTData,
    selectedConstituency
  )
  const stateUTOptions = getStateUTs(selectedYearData)
  const constituencyOptions = getConstituencies(selectedStateUTData)
  const constituencyContestantsStatsData = getConstituencyContestantsStatsData(
    selectedConstituencyData,
    selectedConstituency
  )

  const _handleSelectedYear = (v) => {
    setSelectedYear(v)
  }
  const _handleSelectedRegion = (v) => {
    console.log(v)
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
    console.log(v)
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
              onChange={(e) => console.log("general")}
            />
            <label htmlFor="general">General Elections</label>
            <input
              type="radio"
              id="assembly"
              name="election"
              value="assembly"
              defaultChecked
              onChange={(e) => console.log("assembly")}
            />
            <label htmlFor="assembly">Assembly Elections</label>
          </div>
          <div className="radio-toolbar md:mx-2 my-2">
            <input
              type="radio"
              id="party"
              name="group"
              value="party"
              onChange={(e) => console.log("party")}
            />
            <label htmlFor="party">Party</label>
            <input
              type="radio"
              id="alliance"
              name="group"
              value="alliance"
              defaultChecked
              onChange={(e) => console.log("alliance")}
            />
            <label htmlFor="alliance">Alliance</label>
          </div>
          <div>
            <select
              name="year"
              onChange={(e) => _handleSelectedYear(e.target.value)}
              id="year"
              className="w-28 md:w-64"
            >
              {yearOptions.map((d, index) => (
                <option key={index} value={d.value}>
                  {d.label}
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
          style={{ display: "none" }}
          className="bg-gray-100 z-10 h-full md:h-auto absolute md:relative inset-x-auto top-0 md:top-auto"
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
            <div className="flex flex-wrap mx-auto justify-around md:justify-center ">
              <div>
                <select
                  name="region"
                  onChange={(e) => _handleSelectedRegion(e.target.value)}
                  id="region"
                  className="advance-select"
                >
                  {regionOptions.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="state-ut"
                  onChange={(e) => _handleSelectedStateUT(e.target.value)}
                  id="state-ut"
                  className="advance-select"
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
                  name="locality"
                  onChange={(e) => _handleSelectedLocality(e.target.value)}
                  id="locality"
                  className="advance-select"
                >
                  {localityOptions.map((d, index) => (
                    <option key={index} value={d.value}>
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
                  className="advance-select"
                  value={selectedConstituency}
                >
                  {constituencyOptions.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
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
                  {communityOptions.map((d, index) => (
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
                  {genderOptions.map((d, index) => (
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
                  {crimianalityOptions.map((d, index) => (
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
                  {experienceOptions.map((d, index) => (
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
                  {educationOptions.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  name="seatType"
                  onChange={(e) => _handleSelectedSeatType(e.target.value)}
                  id="seatType"
                  className="advance-select"
                >
                  {seatTypeOptions.map((d, index) => (
                    <option key={index} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex my-4 max-w-sm md:max-w-full mx-auto justify-between md:hidden">
              <div>
                <input type="button" value="RESET" className="black-btn" />
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
        <div className="py-8">
          <MapWidget
            stateGeojson={stateGeojson}
            districtGeojson={districtGeojson}
          />
        </div>
        {/* <PartyAllianceTable selectedYearData={selectedYearData} /> */}
        {constituencyContestantsStatsData !== null && (
          <ConstituencyConstestantsStats
            constituencyContestantsStatsData={constituencyContestantsStatsData}
          />
        )}
      </div>
    )
  } else {
    return <h1>Loading...</h1>
  }
}

export default Dashboard