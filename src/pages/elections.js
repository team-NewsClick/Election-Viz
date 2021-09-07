import { useEffect, useState } from "react"
import Head from "next/head"
import axios from "axios"
import Dashboard from "../components/Dashboard"
import Loading from "../components/helpers/Loading"
import { GEOJSON_PATH } from "../constants"

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = () => {
  const [stateGeojson, setStateGeojson] = useState([])
  const [assemblyConstituenciesGeojson, setAssemblyConstituenciesGeojson] =
    useState([])
  const [
    parliamentaryConstituenciesGeojson,
    setParliamentaryConstituenciesGeojson
  ] = useState([])

  useEffect(() => {
    axios
      .get(`${GEOJSON_PATH}/states.geojson`)
      .then((response) => {
        const parsedData = response.data
        setStateGeojson(parsedData)
      })
      .catch((e) => setStateGeojson([]))
    axios
      .get(`${GEOJSON_PATH}/assembly.geojson`)
      .then((response) => {
        const parsedData = response.data
        setAssemblyConstituenciesGeojson(parsedData)
      })
      .catch((e) => seAassemblyConstituenciesGeojson([]))
    axios
      .get(`${GEOJSON_PATH}/parliament.geojson`)
      .then((response) => {
        const parsedData = response.data
        setParliamentaryConstituenciesGeojson(parsedData)
      })
      .catch((e) => setParliamentaryConstituenciesGeojson([]))
  }, [])

  if (stateGeojson.length === 0 || assemblyConstituenciesGeojson.length === 0) {
    return (
      <div style={{ margin: "auto", paddingTop: "50vh" }}>
        <Loading />
      </div>
    )
  } else {
    return (
      <div className="grid grid-cols-12">
        <Head>
          <title>Indian Election Maps</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="col-span-2 sm:inline-block hidden"></div>
        <div className="col-span-12 mx-5 md:col-span-8 sm:mx-0">
          <Dashboard
            stateGeojson={stateGeojson}
            assemblyConstituenciesGeojson={assemblyConstituenciesGeojson}
            parliamentaryConstituenciesGeojson={
              parliamentaryConstituenciesGeojson
            }
          />
        </div>
        <div className="col-span-2 sm:inline-block hidden"></div>
      </div>
    )
  }
}

export default Elections
