import { promises as fs } from "fs"
import path from "path"
import { csvParse } from "d3-dsv"

export async function getCSVdata() {
  const csvDirectory = path.join(process.cwd(), "/data/csv")
  const fileNames = await fs.readdir(csvDirectory)
  const allCSVData = fileNames.map(async (fileName) => {
    const filePath = path.join(csvDirectory, fileName)
    const fileContents = await fs.readFile(filePath, "utf-8")
    const csvData = csvParse(fileContents)
    return {
      fileNames,
      content: csvData
    }
  })

  return allCSVData
}
// import fs from "fs"
// import path from "path"
// import { csvParse } from "d3-dsv"

// const csvDirectory = path.join(process.cwd(), "/data/csv")
// console.log(csvDirectory)
// export async function getCSVdata() {
//   const fileNames = fs.readdirSync(csvDirectory)

//   const allCSVData = fileNames.map((fileName) => {
//     const fileNameID = fileName.replace(/\.csv$/, "")
//     const fullPath = path.join(csvDirectory, fileName)
//     const fileContents = fs.readFileSync(fullPath, "utf-8")
//     const csvData = csvParse(fileContents)
//     return csvData
//   })

//   // console.log(JSON.stringify(allCSVData))

//   return allCSVData
// }
