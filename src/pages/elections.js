import fs from "fs"
import path from "path"
import Head from "next/head"
import Loading from "../components/helpers/Loading"
import dynamic from "next/dynamic"
import Dashboard from "../components/Dashboard"

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), "public/data/geojson/")
  const fileNames = fs.readdirSync(dataDir)

  const geoJsons = fileNames.map((fileName) => {
    const filePath = path.join(dataDir, fileName)
    const fileContents = fs.readFileSync(filePath, "utf-8")
    const fileNameKeys = fileName.split(".")
    let jsonObj = {}
    jsonObj[fileNameKeys[0]] = JSON.parse(fileContents)
    return jsonObj
  })
  return {
    props: {
      assemblyConstituenciesGeojson: geoJsons[0].assembly,
      parliamentaryConstituenciesGeojson: geoJsons[1].parliament,
      stateGeojson: geoJsons[2].states
    }
  }
}


/**
 * Dynamic loading, component won't even be rendered on the server-side
 * @return {JSX.Element} Dashboard
 */
// const Dashboard = dynamic(() => import("../components/Dashboard"), {
//   ssr: false
// })

/**
 * Map Page
 * @return {JSX.Element} Map Page
 */
const Elections = ({
  assemblyConstituenciesGeojson,
  parliamentaryConstituenciesGeojson,
  stateGeojson
}) => {
  // if (
  //   (stateGeojson.length === 0 || assemblyConstituenciesGeojson.length === 0,
  //   parliamentaryConstituenciesGeojson.length === 0)
  // ) {
  //   return (
  //     <div style={{ margin: "auto", paddingTop: "50vh" }}>
  //       <Loading />
  //     </div>
  //   )
  // } else {
  //   return (
  //     <div className="grid grid-cols-12">
  //       <Head>
  //         <title>Indian Election Maps</title>
  //         <meta charSet="utf-8" />
  //         <meta
  //           name="viewport"
  //           content="initial-scale=1.0, width=device-width"
  //         />
  //       </Head>
  //       <div className="col-span-2 sm:inline-block hidden"></div>
  //       <div className="col-span-12 mx-5 md:col-span-8 sm:mx-0">
  //         <Dashboard
  //           stateGeojson={stateGeojson}
  //           assemblyConstituenciesGeojson={assemblyConstituenciesGeojson}
  //           parliamentaryConstituenciesGeojson={
  //             parliamentaryConstituenciesGeojson
  //           }
  //         />
  //       </div>
  //       <div className="col-span-2 sm:inline-block hidden"></div>
  //     </div>
  //   )
  // }
  return (
    <div className="grid grid-cols-12">
      <Head>
        <title>Indian Election Maps</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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

export default Elections
