import { useEffect, useState } from "react"
import axios from "axios"
import { csvParse } from "d3-dsv"
import DropDown from "./DropDown"
import { dropDownDefaultSelect } from "../constants"
import { InfographicsSettings } from "./infographics"

/**
 * Dashboard Component
 * @return {JSX.Element} Dashboard Component
 */
const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(dropDownDefaultSelect.value)
  const [selectedYearData, setSelectedYearData] = useState([])

  useEffect(() => {
    axios.get(`/data/csv/assembly_${selectedYear}.csv`).then((response) => {
      const parsedData = csvParse(response.data)
      setSelectedYearData(parsedData)
    })
  }, [selectedYear])

  const _handleSelectChange = (e) => {
    setSelectedYear(e)
  }
  if (selectedYearData.length !== 0) {
    return (
      <div>
        <DropDown onChange={_handleSelectChange} />
        <InfographicsSettings
          selectedYear={selectedYear}
          selectedYearData={selectedYearData}
        />
      </div>
    )
  } else {
    return <h1>Loading</h1>
  }
}

export default Dashboard
