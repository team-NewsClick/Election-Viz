import fs from "fs"
import path from "path"

/**
 * Load Assembly/Parliament JSON Files during build process
 * @return {Array.<Object>} Array of JSON Objects
 */
export async function getJsonData() {
  const jsonDirectory = path.join(process.cwd(), "data/json")
  const fileNames = fs.readdirSync(jsonDirectory)

  const allJsonData = fileNames.map((fileName) => {
    const filePath = path.join(jsonDirectory, fileName)
    const fileContents = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    return {
      fileName,
      fileContents
    }
  })

  return allJsonData
}
