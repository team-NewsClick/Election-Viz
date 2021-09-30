import Head from "next/head"
import { useState, useEffect } from "react"
import axios from "axios"
import Loading from "../components/helpers/Loading"
import Dashboard from "../components/Dashboard"
import { GEOJSON_PATH } from "../constants"

/**
 * Electon Viz Page
 * @return {JSX.Element} Electon Viz Page
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
      .catch((e) => setAssemblyConstituenciesGeojson([]))
    axios
      .get(`${GEOJSON_PATH}/parliament.geojson`)
      .then((response) => {
        const parsedData = response.data
        setParliamentaryConstituenciesGeojson(parsedData)
      })
      .catch((e) => setParliamentaryConstituenciesGeojson([]))
  }, [])

  if (process.browser) {
    if (
      stateGeojson.length === 0 ||
      assemblyConstituenciesGeojson.length === 0
    ) {
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
            <div className="my-4 text-center text-2xl font-bold">
              Election Maps
            </div>
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
  } else {
    return (
      <div style={{ margin: "auto", paddingTop: "50vh" }}>
        <Loading />
      </div>
    )
  }
}

export default Elections
