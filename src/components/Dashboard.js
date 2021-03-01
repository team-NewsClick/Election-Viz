import { useEffect, useState } from "react"
import { csvParse } from "d3-dsv"
import DropDown from "./DropDown"
import { InfographicsSettings } from "./infographics"

/**
 * Dashboard Component
 * @return {JSX.Element} Dashboard Component
 */
const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(null)
  const [selectedYearData, setSelectedYearData] = useState([])
  const [allYearsData, setAllYearsData] = useState([])

  useEffect(() => {
    const fetchCSV = () => {
      fetch(`${process.env.API_URL_CSV}assembly_${selectedYear}.csv`)
      // fetch(`/data/csv/assembly_${selectedYear}.csv`)
        .then((res) => res.text())
        .then(csvParse)
        .then(setSelectedYearData)
    }
    if (selectedYear) {
      fetchCSV()
      console.log(selectedYearData)
    }
  }, [selectedYear])

  const _handleSelectChange = (e) => {
    if (e) {
      setSelectedYear(e)
      // if (selectedYearData.length !== 0) {
      //   setAllYearsData([
      //     ...allYearsData,
      //     { year: selectedYear, data: selectedYearData }
      //   ])
      // }
      // console.log("All Data: ", allYearsData)
    }
  }
  return (
    <div>
      <DropDown onChange={_handleSelectChange} />
      {/* <InfographicsSettings /> */}
    </div>
  )
}

export default Dashboard
