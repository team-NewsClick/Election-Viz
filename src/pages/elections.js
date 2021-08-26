import { useEffect, useState } from "react"
import axios from "axios"
import Dashboard from "../components/Dashboard"
import Loading from "../components/helpers/Loading"

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = () => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [
    parliamentaryConstituenciesGeojson,
    setParliamentaryConstituenciesGeojson
  ] = useState([])
  const [assemblyConstituenciesGeojson, setAssemblyConstituenciesGeojson] =
    useState([])

  useEffect(() => {
    axios
      .get(`/data/geojson/states.geojson`)
      .then((response) => {
        const parsedData = response.data
        setStateGeojson(parsedData)
      })
      .catch((e) => setStateGeojson([]))
    axios
      .get(`/data/geojson/parliament.geojson`)
      .then((response) => {
        const parsedData = response.data
        setParliamentaryConstituenciesGeojson(parsedData)
      })
      .catch((e) => setParliamentaryConstituenciesGeojson([]))
    axios
      .get(`/data/geojson/assembly.geojson`)
      .then((response) => {
        const parsedData = response.data
        setAssemblyConstituenciesGeojson(parsedData)
      })
      .catch((e) => seAassemblyConstituenciesGeojson([]))
  }, [])

  if (
    stateGeojson.length === 0 ||
    parliamentaryConstituenciesGeojson.length === 0 ||
    assemblyConstituenciesGeojson.length === 0
  ) {
    return <div style={{ minHeight: "100%", height: "100%", margin: "auto", paddingTop: "30%" }}>
            <Loading/>
          </div>
  } else {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-2 sm:inline-block hidden"></div>
        <div className="col-span-12 mx-5 md:col-span-8 sm:mx-0">
          <Dashboard
            stateGeojson={stateGeojson}
            parliamentaryConstituenciesGeojson={
              parliamentaryConstituenciesGeojson
            }
            assemblyConstituenciesGeojson={assemblyConstituenciesGeojson}
          />
        </div>
        <div className="col-span-2 sm:inline-block hidden"></div>
      </div>
    )
  }
}

export default Elections
