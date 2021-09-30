import { DEFAULT_PARTY_ALLIANCE_COLOR, SELECT_STATE_UT } from "../constants"

/**
 * To Calculate list of Parties/Alliances and their seats won in a region
 * @param {Array<Object>} data  Selected year data
 * @param {string} electionViewType general or assembly
 * @param {string} groupType party or alliance
 * @param {string} selectedStateUT Selected State/UT
 * @param {GeoJSON} filteredGeoJSON - Filtered GeoJson
 * @returns {Object<Object>} - List of Parties/Alliances and their seats won in a region
 */
export const getRegionStatsSVGData = (
  data,
  electionViewType,
  groupType,
  selectedStateUT,
  filteredGeoJSON
) => {
  let filteredData = {}
  if (selectedStateUT === SELECT_STATE_UT) return filteredData
  if (electionViewType === "general") {
    filteredGeoJSON.features.map((d) => {
      if (
        data[d.properties.ST_NAME] &&
        data[d.properties.ST_NAME][d.properties.PC_NO]
      ) {
        if (filteredData[`${d.properties.ST_NAME}`]) {
          filteredData[`${d.properties.ST_NAME}`][`${d.properties.PC_NO}`] =
            data[d.properties.ST_NAME][d.properties.PC_NO]
        } else {
          filteredData[`${d.properties.ST_NAME}`] = {}
          filteredData[`${d.properties.ST_NAME}`][`${d.properties.PC_NO}`] =
            data[d.properties.ST_NAME][d.properties.PC_NO]
        }
      }
    })
  } else {
    filteredGeoJSON.features.map((d) => {
      if (
        data[d.properties.ST_NAME] &&
        data[d.properties.ST_NAME][d.properties.AC_NO]
      ) {
        if (filteredData[`${d.properties.ST_NAME}`]) {
          filteredData[`${d.properties.ST_NAME}`][`${d.properties.AC_NO}`] =
            data[d.properties.ST_NAME][d.properties.AC_NO]
        } else {
          filteredData[`${d.properties.ST_NAME}`] = {}
          filteredData[`${d.properties.ST_NAME}`][`${d.properties.AC_NO}`] =
            data[d.properties.ST_NAME][d.properties.AC_NO]
        }
      }
    })
  }
  const count = seatsCount(filteredData, groupType)
  return count
}

/**
 * To calculate for Party/Alliance and their respective seats won
 * @param {Array<Object>} data Selected region data
 * @param {string} groupType party or alliance
 * @returns {Array<Object>} - Party/Alliance and their respective seats won
 */
export const seatsCount = (data, groupType) => {
  let groups = {},
    finalData = {}
  if (groupType === "party") {
    for (const state in data) {
      for (const row in data[state]) {
        groups[data[state][row].party]
          ? (groups[data[state][row].party].seats += 1)
          : (groups[data[state][row].party] = {
              seats: 1,
              colour: data[state][row].color
            })
      }
    }
  } else {
    for (const state in data) {
      for (const row in data[state]) {
        groups[data[state][row].alliance]
          ? (groups[data[state][row].alliance].seats += 1)
          : (groups[data[state][row].alliance] = {
              seats: 1,
              colour: data[state][row].color
            })
      }
    }
  }
  const preSort = Object.entries(groups)
  const sortedData = preSort.sort((a, b) =>
    a[1].seats < b[1].seats ? 1 : b[1].seats < a[1].seats ? -1 : 0
  )
  let topTen = []
  if (sortedData.length <= 10) {
    topTen = sortedData
    const tempIndexOTHERS = topTen.findIndex((d) => d[0] === "OTHERS")
    if (tempIndexOTHERS !== -1) {
      const tempDataOTHERS = topTen.splice(tempIndexOTHERS, 1)
      topTen.push(...tempDataOTHERS)
    }
  } else {
    if (sortedData.length < 10) {
      sortedData.map((d, index) => (topTen[index] = d))
    } else {
      sortedData.map((d, index) => {
        if (index < 9) topTen[index] = d
      })
      topTen.push([
        "OTHERS",
        { seats: 0, colour: DEFAULT_PARTY_ALLIANCE_COLOR }
      ])
      sortedData.map((d, index) => {
        if (index >= 9) topTen[9][1].seats += parseInt(d[1].seats)
      })
    }
  }
  topTen.map(
    (d) => (finalData[d[0]] = { seats: d[1].seats, colour: d[1].colour })
  )
  return finalData
}
