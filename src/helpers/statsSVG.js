import {
  STATE_UT_DEFAULT_SELECT,
  DEFAULT_PARTY_ALLIANCE_COLOR
} from "../constants"

/**
 * To Calculate list of Parties/Alliances and their seats won in a region
 * @param {Array<Object>} data  Selected year data
 * @param {string} electionViewType general or assembly
 * @param {string} groupType party or alliance
 * @param {string} selectedStateUT Selected State/UT
 * @returns {Object<Object>} - List of Parties/Alliances and their seats won in a region
 */
export const getRegionStatsSVGData = (
  data,
  electionViewType,
  groupType,
  selectedStateUT,
  filteredGeoJSON
) => {
  if (electionViewType === "general") {
    const filteredData = data.filter((d) => {
      if (
        filteredGeoJSON.features.findIndex(
          (e) => e.properties.PC_NAME === d.pc_name
        ) > -1
      ) {
        return d
      }
    })
    const count = seatsCount(filteredData, groupType)
    return count
  } else {
    if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
      return []
    } else {
      const filteredData = data.filter((d) => {
        if (
          filteredGeoJSON.features.findIndex(
            (e) => e.properties.AC_NAME === d.ac_name
          ) > -1
        ) {
          return d
        }
      })
      const count = seatsCount(filteredData, groupType)
      return count
    }
  }
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
    data.map((d) => {
      if (groups[d.party]) {
        groups[d.party].seats += 1
      } else {
        groups[d.party] = { seats: 1, colour: d.color }
      }
    })
  } else {
    data.map((d) => {
      if (groups[d.alliance]) {
        groups[d.alliance].seats += 1
      } else {
        groups[d.alliance] = { seats: 1, colour: d.color }
      }
    })
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
    if(sortedData.length < 10) {
      sortedData.map((d, index) => {
          topTen[index] = d
      })
    } else {
      sortedData.map((d, index) => {
        if (index < 9) {
          topTen[index] = d
        }
      })
      topTen.push([
        "OTHERS",
        { seats: 0, colour: DEFAULT_PARTY_ALLIANCE_COLOR }
      ])
      sortedData.map((d, index) => {
        if (index >= 9) {
          topTen[9][1].seats += parseInt(d[1].seats)
        }
      })
    }
  }
  topTen.map((d) => {
    finalData[d[0]] = { seats: d[1].seats, colour: d[1].colour }
  })
  return finalData
}
