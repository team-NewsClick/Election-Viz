import { useEffect, useState } from "react"
import Dashboard from "../components/Dashboard"
import Loading from "../components/Loading"

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
  const [
    assemblyConstituenciesGeojson,
    setAssemblyConstituenciesGeojson
  ] = useState([])

  useEffect(() => {
    const fetchStateGeojson = () => {
      fetch(`/data/geojson/states.geojson`)
        .then((res) => res.json())
        .then(setStateGeojson)
    }
    const fetchParliamentaryConstituenciesGeojson = () => {
      fetch(`/data/geojson/parliament.geojson`)
        .then((res) => res.json())
        .then(setParliamentaryConstituenciesGeojson)
    }
    const fetchAssemblyConstituenciesGeojson = () => {
      fetch(`/data/geojson/assembly.geojson`)
        .then((res) => res.json())
        .then(setAssemblyConstituenciesGeojson)
    }
    fetchStateGeojson()
    fetchParliamentaryConstituenciesGeojson()
    fetchAssemblyConstituenciesGeojson()
  }, [])

  if (
    stateGeojson.length === 0 ||
    parliamentaryConstituenciesGeojson.length === 0
  ) {
    return <Loading />
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
