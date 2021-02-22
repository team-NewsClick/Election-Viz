import { useEffect, useState } from "react"
import { csvParse } from "d3-dsv"
import Select from "react-select"
import makeAnimated from "react-select/animated"
// import MapDashboard from "../components/maps/MapDashboard"

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = () => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [districtGeojson, setDistrictGeojson] = useState([])
  const [selectedYear, setSelectedYear] = useState("2019")
  const [allYears, setAllYears] = useState([])
  const [yearByData, setYearByData] = useState([])
  const [allData, setAllData] = useState([])

  const defaultSelect = "2019"
  const dropDownOptions = [
    {
      value: "2019",
      label: "2019"
    },
    {
      value: "2016",
      label: "2016"
    },
    {
      value: "2015",
      label: "2015"
    },
    {
      value: "2014",
      label: "2014"
    }
  ]

  useEffect(() => {
    const fetchStateGeojson = () => {
      fetch(`/geojson/states.geojson`)
        .then((res) => res.json())
        .then(setStateGeojson)
    }
    const fetchDistrictGeojson = () => {
      fetch(`/geojson/districts.geojson`)
        .then((res) => res.json())
        .then(setDistrictGeojson)
    }
    fetchStateGeojson()
    fetchDistrictGeojson()
  }, [])

  useEffect(() => {
    const fetchYear = () => {
      fetch(`/data/csv/assembly_${selectedYear}.csv`)
        .then((res) => res.text())
        .then(csvParse)
        .then(setYearByData)
        .then(
          setAllData([...allData, { year: selectedYear, data: yearByData }])
        )
      setAllYears([...allYears, selectedYear])
    }
    let yearBool = allYears.includes(selectedYear)
    if (!yearBool) {
      fetchYear()
    }
    console.log("All Data: ", allData)
    console.log("All Years: ", allYears)
  }, [selectedYear])

  const _handleSelectChange = (e) => {
    if (e) {
      console.log(e)
      setSelectedYear(e.value)
    }
  }
  if (stateGeojson.length === 0 || districtGeojson.length === 0) {
    return <h1>Loading</h1>
  } else {
    return (
      <div>
        <div className="flex justify-center">
          <div className="container max-w-xl mx-auto">
            <Select
              components={makeAnimated}
              placeholder="Select a Year"
              name="selectOptions"
              onChange={_handleSelectChange}
              defaultValue={defaultSelect}
              options={dropDownOptions}
              isSearchable
            />
          </div>
        </div>
        {/* <MapDashboard
          stateGeojson={stateGeojson}
          districtGeojson={districtGeojson}
        /> */}
      </div>
    )
  }
}

export default Elections
