import { data } from "autoprefixer";
import {
  STATE_UT_DEFAULT_SELECT,
  PARTY_COLOR,
  DEFAULT_PARTY_ALLIANCE_COLOR
} from "../constants"

import { assignColor } from "./utils"
var _ = require('lodash');

/**
 * To Calculate list of Parties/Alliances and their seats won in a region
 * @param {Array<Object>} data  Selected year data
 * @param {string} electionType general or assembly
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @param {string} selectedStateUT Selected State/UT
 * @returns {Object<Object>} - List of Parties/Alliances and their seats won in a region
 */
export const getRegionStatsSVGData = (
  data,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  filteredGeoJSON
) => {
  if (electionType === "general") {
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
            (e) => e.properties.AC_NAME === d.AC_NAME
          ) > -1
        ) {
          return d
        }
      })
      const electedCandidates = getAssemblyResultsByVotes(
        filteredData,
        groupType,
        partyAlliance
      )
      const count = seatsCount(electedCandidates, groupType, partyAlliance)
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
  let preSort = []
  if (groupType === "party") {
    const partiesCount = data.reduce(
      (acc, o) => (
        (acc[o.party || o.PARTY] = (acc[o.party || o.PARTY] || 0) + 1), acc
      ),
      {}
    )
    const keys = Object.keys(partiesCount)
    const partyData = []
    keys.map((key) => {
      const values = {
        party: key,
        totalSeats: partiesCount[key]
      }
      partyData.push(values)
    })
    preSort = partyData
  } else {
    const alliancesCount = data.reduce(
      (acc, o) => (
        (acc[o.alliance || o.ALLIANCE] =
          (acc[o.alliance || o.ALLIANCE] || 0) + 1),
        acc
      ),
      {}
    )
    const keys = Object.keys(alliancesCount)
    const allianceData = []
    keys.map((key) => {
      const values = {
        alliance: key,
        totalSeats: alliancesCount[key]
      }
      allianceData.push(values)
    })
    preSort = allianceData
  }
  const sortedData = preSort.sort((a, b) =>
    a.totalSeats < b.totalSeats ? 1 : b.totalSeats < a.totalSeats ? -1 : 0
  )
  let topNine = []
  if (sortedData.length <= 9) {
    topNine = sortedData
  } else {
    sortedData.map((d, index) => {
      if (index < 9) {
        topNine.push(d)
      }
      if (index >= 9) {
        groupType === "party"
          ? (topNine[8].party = "OTHERS")
          : (topNine[8].alliance = "OTHERS")
        topNine[8].totalSeats += d.totalSeats
      }
    })
  }
  if (
    groupType === "alliance" &&
    topNine.findIndex((d) => (d.party || d.alliance) === "OTHERS") > -1
  ) {
    const temp =
      topNine[topNine.findIndex((d) => (d.party || d.alliance) === "OTHERS")]
    topNine.splice(
      topNine.findIndex((d) => (d.party || d.alliance) === "OTHERS"),
      1
    )
    topNine.push(temp)
  }
  const finalData = {}
  topNine.map((row) => {
    finalData[row.party || row.alliance] = {
      seats: row.totalSeats,
      colour: assignColor(row)
    }
  })
  return finalData
}

/**
 * To get assembly elections data of a region by no of votes
 * @param {Array<Object>} data Selected region data
 * @returns {Array<Object>} - Election data of a region
 */
export const getAssemblyResultsByVotes = (data, groupType, partyAlliance) => {
  const finalResult = []
  if(groupType === "party") {
    var grouped = _.mapValues(_.groupBy(data, 'AC_NAME'))
    var keys = Object.keys(grouped)
    keys.map((key) => {
      let candidateElected = grouped[key].reduce((max, obj) => (max.VOTES > obj.VOTES) ? max : obj);
      finalResult.push(candidateElected)
    })
  } else {
    var grouped = _.mapValues(_.groupBy(data, 'AC_NAME'))
    var keys = Object.keys(grouped)
    keys.map((key) => {
      let candidateElected = grouped[key].reduce((max, obj) => (max.VOTES > obj.VOTES) ? max : obj);
      const alliance = partyAlliance.find((e) => e.PARTY == candidateElected.PARTY) && partyAlliance.find((e) => e.PARTY == candidateElected.PARTY).ALLIANCE
      finalResult.push({
        candidate: candidateElected.CANDIDATE,
        color:
          PARTY_COLOR.find((e) => e.party == alliance) == undefined
            ? DEFAULT_PARTY_ALLIANCE_COLOR
            : PARTY_COLOR.find((e) => e.party == alliance).color,
        alliance: alliance,
        ac_name: candidateElected.AC_NAME,
        votes: candidateElected.VOTES
      })
    })
  }
  return finalResult
}

/**
 * To get assembly elections data of a regon
 * @param {Array<Object>} data Selected region data
 * @param {string} groupType party or alliance
 * @param {Array<Object>} partyAlliance List of Parties and their respective alliance
 * @returns {Array<Object>} - Election data of a region
 */
export const getAssemblyResults = (data, groupType, partyAlliance) => {
  const finalData = []
  // const finalResult = getAssemblyResultsByVotes(data)
  if (groupType === "party") {
    data
      .filter((candidates) => candidates.POSITION === "1")
      .map((row) => {
        finalData.push(row)
      })
  } else {
    data
      .filter((candidates) => candidates.POSITION === "1")
      .map((row) => {
        const alliance = partyAlliance.find((e) => e.PARTY == row.PARTY)
          ? partyAlliance.find((e) => e.PARTY === row.PARTY).ALLIANCE
          : "OTHERS"
        finalData.push({
          candidate: row.CANDIDATE,
          color:
            PARTY_COLOR.find((e) => e.party == alliance) == undefined
              ? DEFAULT_PARTY_ALLIANCE_COLOR
              : PARTY_COLOR.find((e) => e.party == alliance).color,
          alliance: alliance,
          ac_name: row.AC_NAME,
          votes: row.VOTES
        })
      })
  }
  return finalData
}
