import {
  STATE_UT_DEFAULT_SELECT,
  PARTY_COLOR,
  CONSTITUENCIES_DEFAULT_SELECT,
  DEFAULT_PARTY_ALLIANCE_COLOR
} from "./constants"
import axios from "axios"

/**
 * Returns a list of States and UTs that had election in a year
 * @param {Array.<Object>} data - Array of Objects having a year of data
 * @return {Array} List of States and UTS that had election in a year
 */
export const getStateUTs = (data) => {
  if (data === null) {
    return null
  } else {
    let stateUTs = new Set()
    data.map((row) => {
      stateUTs.add(row.ST_NAME)
    })
    stateUTs = [...stateUTs]
    if (stateUTs.length > 1) {
      stateUTs.unshift(STATE_UT_DEFAULT_SELECT)
    }
    return stateUTs
  }
}

/**
 * Returns a list of constituencies of a State/UT
 * @param {Array.<Object>} data - Data of a State/UT's election of a year
 * @return {Array} List of Constituencies in a State/UT
 */
export const getConstituencies = (data, selectedStateUT, electionType) => {
  let constituencies = new Set()
  if (data === null) {
    return null
  } else {
    if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
      constituencies.add("First Select a State or UT")
    } else {
      data.map((row) => {
        constituencies.add(
          electionType === "general" ? row.PC_NAME : row.AC_NAME
        )
      })
    }
    constituencies = [...constituencies]
    if (constituencies.length > 1) {
      constituencies.unshift(CONSTITUENCIES_DEFAULT_SELECT)
    }
    return constituencies
  }
}

/**
 * Returns Data of a election year for a State/UT
 * @param {Array<Object>} data - Data of a election year
 * @param {string} stateUT -Name of State/UT
 * @returns {Array<Object>} Data of a election year for a State/UT
 */
export const getDataStateUT = (data, stateUT) => {
  if (stateUT === "All States & UT") {
    return data
  } else {
    return data.filter((row) => {
      return row.ST_NAME === stateUT
    })
  }
}

/**
 * Returns data of a election year for a Constituency
 * @param {Array<Object>} data - State data of a year
 * @param {string} constituency - Name of Constituency
 * @return {Array.<Object>} Data of a election year for a Constituency
 */
export const getDataConstituency = (data, constituency, electionType) => {
  if (constituency === "All Constituencies") {
    return data
  } else {
    if (electionType === "general") {
      return data.filter((row) => {
        return row.PC_NAME === constituency
      })
    } else {
      return data.filter((row) => {
        return row.AC_NAME === constituency
      })
    }
  }
}

/**
 * Returns contains Array of Objects having data as a stats for every Contestants and an Object having total summary of the stats
 * @param {Array<Object>} data - Data of a election year for a Constituency
 * @param {string} constituency - Name of Constituency
 * @return {Object} Contains Array of Objects having data as a stats for every Contestants and an Object having total summary of the stats
 */
export const getConstituencyContestantsStatsData = (data, constituency) => {
  if (constituency !== "All Constituencies") {
    let candidates = new Set()
    data.map((row) => {
      candidates.add(row.CANDIDATE)
    })
    candidates = [...candidates]
    let stats = []
    let totalVotes = 0
    let totalParties = 0
    candidates.map((c) => {
      let votes = 0
      let party = "--"
      data.map((d) => {
        if (d.CANDIDATE === c) {
          votes = votes + parseInt(d.VOTES)
          totalVotes = totalVotes + parseInt(d.VOTES)
          party = d.PARTY
        }
      })
      stats.push({
        candidate: c,
        party: party,
        alliance: "--",
        votesReceived: votes
      })
    })
    stats.map((row) => {
      totalParties = row.party !== "IND" ? totalParties + 1 : totalParties + 0
    })
    let totalStats = {
      candidates: candidates.length,
      parties: totalParties,
      alliances: "--",
      votes: totalVotes
    }
    let highest = 0
    stats.map((d) => {
      highest = d.votesReceived > highest ? d.votesReceived : highest
    })
    stats.map((d) => {
      return d.votesReceived === highest
        ? (d.status = "won")
        : (d.status = "lost")
    })
    return { stats, totalStats }
  } else return null
}

/**
 * Find Party color
 * @param {*} data - Array of Party and Total Seats
 * @returns - Hex Color
 */
const assignColor = (data) => {
  return PARTY_COLOR.find((e) => e.party == (data.party || data.alliance)) ==
    undefined
    ? DEFAULT_PARTY_ALLIANCE_COLOR
    : PARTY_COLOR.find((e) => e.party == (data.party || data.alliance)).color
}

/**
 *
 * @param {Array} data
 * @returns
 */
export const seatsCount = (data, groupType, partyAlliance) => {
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
 * Calculate Data for selected region stats table
 * @param {Array<Object>} data Selected State or UT data
 * @param {object<Object>} SVGData Data for region stats SVG
 * @param {String} electionType general or assembly
 * @param {String} groupType party or alliance
 * @param {Array<Object>} partyAlliance party and their respective alliance
 * @param {String} selectedStateUT Selected State or UT
 * @param {String} selectedConstituency Selected Constituency
 * @returns {Array<Objects>} - Data of Party and their seats won, votes received, seats difference with respect to previous election, percentage of votes received, difference of percentage of votes received with respect to last election
 */
export const getRegionStatsTable = (data, SVGData, electionType, groupType, partyAlliance, selectedStateUT, selectedConstituency, prevYearData) => {

  const getYearDataTable = (data, SVGData, electionType, groupType, partyAlliance, selectedStateUT, selectedConstituency) => {
    let totalVotes = 0
    let tableData = []
    if(selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT ||selectedStateUT ===  STATE_UT_DEFAULT_SELECT) {
      if(groupType === "party") {
        for( const property in SVGData) {
          tableData.push(
            {
              party: `${property}`,
              seats: `${SVGData[property].seats}`,
              votes: 0,
              seatsDifference: 0,
              votesWonPercentage: 0,
              votesWonPercentageDifference: 0
            }
          )
        }
        if(tableData.indexOf(tableData.find(({ party }) => party == "OTHERS")) < 0) {
          tableData.push(
            {
              party: "OTHERS",
              seats: 0,
              votes: 0,
              seatsDifference: 0,
              votesWonPercentage: 0,
              votesWonPercentageDifference: 0
            }
          )
        }
      } else {
        for( const property in SVGData) {
          tableData.push(
            {
              alliance: `${property}`,
              seats: `${SVGData[property].seats}`,
              votes: 0,
              seatsDifference: 0,
              votesWonPercentage: 0,
              votesWonPercentageDifference: 0
            }
          )
        }
        if(tableData.indexOf(tableData.find(({ alliance }) => alliance == "OTHERS")) < 0) {
          tableData.push(
            {
              alliance: "OTHERS",
              seats: 0,
              votes: 0,
              seatsDifference: 0,
              votesWonPercentage: 0,
              votesWonPercentageDifference: 0
            }
          )
        }
      }    
      if(groupType === "party") {
        data.map((d, index) => {
          let temp = tableData.indexOf(tableData.find(({ party }) => party == d.PARTY))
          if(temp > -1) {
            tableData[temp].votes += parseInt(d.VOTES)
          }
          else {
            parseInt(d.VOTES) && tableData[tableData.length - 1] && (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
            }
        })
      }else {
        data.map((d, index) => {
          let temp = partyAlliance.find((e) => e.PARTY == d.PARTY) && tableData.indexOf(tableData.find(({ alliance }) => alliance == partyAlliance.find((e) => e.PARTY == d.PARTY).ALLIANCE))
          if(temp > -1) {
            tableData[temp].votes += parseInt(d.VOTES)
          }
          else {
            parseInt(d.VOTES) && tableData[tableData.length - 1] && (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
            }
        })
      }
    } else {
      let constituencyStats = []
      if(electionType === "general") {
        if(data.find(c => c.PC_NAME == selectedConstituency)) {
          constituencyStats = data.find(c => c.PC_NAME == selectedConstituency).stats
        }
      } else {
        if(data.find(c => c.AC_NAME == selectedConstituency)) {
          constituencyStats = data.find(c => c.AC_NAME == selectedConstituency).stats
        }
      }
      if(groupType === "party") {
        constituencyStats.map((d, index) =>
          tableData.push({
            party: d.party,
            seats: index == 0 ? 1 : 0,
            votes: d.votesReceived,
            seatsDifference: 0,
            votesWonPercentage: 0,
            votesWonPercentageDifference: 0
          })
        )
      }
      else {
        let alliances = new Set()
        constituencyStats.map((d, index) => {
          partyAlliance.find((e) => e.PARTY == d.party)
            ? alliances.add(partyAlliance.find((e) => e.PARTY === d.party).ALLIANCE)
            : alliances.add("OTHERS")
        })
        alliances =[...alliances]
        alliances.map((d, index) => {
          tableData.push({
            alliance: d,
            seats: index == 0 ? 1 : 0,
            votes: 0,
            seatsDifference: 0,
            votesWonPercentage: 0,
            votesWonPercentageDifference: 0
          })
        })
        constituencyStats.map((d, index) => {
          let tempAlliance = partyAlliance.find((e) => e.PARTY == d.party) ? partyAlliance.find((e) => e.PARTY == d.party).ALLIANCE : "OTHERS"
          let tempIndex = tableData.indexOf(tableData.find(({ alliance }) => alliance == tempAlliance))
          tableData[tempIndex].votes += d.votesReceived
        })
      }
    }
    tableData.map((d, index) => totalVotes += d.votes)
    tableData.map((d, index) => d.votesWonPercentage = (d.votes/totalVotes*100).toFixed(2))
    return tableData
  }

  const getPrevYearDataTable = (prevYearData, electionType, groupType, partyAlliance, selectedStateUT, selectedConstituency) => {
    
    
    let prevStateUTMapData = {}
    let prevSVGData = {}
    let prevSelectedStateUTData  =[]
    
    if(prevYearData.length !== 0) {
      prevSelectedStateUTData = getDataStateUT(prevYearData, selectedStateUT)
    }
    console.log("prevSelectedStateUTData: ", prevSelectedStateUTData)
    const prevSelectedConstituencyData = prevSelectedStateUTData && getDataConstituency(prevSelectedStateUTData, selectedConstituency, electionType)
    if (prevYearData != []) {
      prevStateUTMapData = getStateUTMapDataPC(prevYearData, selectedStateUT, electionType)
    }
    const prevConstituenciesResults = prevStateUTMapData && getConstituenciesResults(prevStateUTMapData, selectedConstituency, electionType, groupType, partyAlliance)
    if (electionType === "general") {
      prevSVGData = prevConstituenciesResults && getRegionStatsSVGData(prevConstituenciesResults, electionType, groupType, partyAlliance)
    } else {
      prevSVGData = getRegionStatsSVGData(
                      selectedStateUT === STATE_UT_DEFAULT_SELECT
                        ? selectedYearData
                        : selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
                        ? prevSelectedStateUTData
                        : prevSelectedConstituencyData,
                      electionType, groupType, partyAlliance, selectedStateUT
                      )
    }

    const prevRegionStatsTableData = getRegionStatsTable(
      selectedStateUT === STATE_UT_DEFAULT_SELECT
        ? prevYearData
        : selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
        ? prevSelectedStateUTData
        : prevStateUTMapData.constituencies,
        prevSVGData,
      electionType,
      groupType,
      partyAlliance,
      selectedStateUT,
      selectedConstituency
    )

    return prevRegionStatsTableData

  }


  console.log("pyd: ", prevYearData)

  const prevYearDataTable = prevYearData && getPrevYearDataTable(prevYearData, electionType, groupType, partyAlliance, selectedStateUT, selectedConstituency)
  const presentYearDataTable = getYearDataTable(data, SVGData, electionType, groupType, partyAlliance, selectedStateUT, selectedConstituency)

  console.log("prevYearDataTable: ", prevYearDataTable)


  // return tableData
  return []
}

/**
 *
 * @param {Array} data
 * @param {string} electionType
 * @returns
 */
export const getRegionStatsSVGData = (
  data,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT
) => {
  if (electionType === "general") {
    const count = seatsCount(data, groupType)
    return count
  } else {
    if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
      return []
    } else {
      const electedCandidates = getAssemblyResults(
        data,
        groupType,
        partyAlliance
      )
      const count = seatsCount(electedCandidates, groupType, partyAlliance)
      return count
    }
  }
}

/**
 *
 * @param {Array} data
 * @returns
 */
export const getAssemblyResults = (data, groupType, partyAlliance) => {
  const finalData = []
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

/**
 *
 * @param {Object} data {StateUT, PC_NAME, Top 4 contestants}
 * @param {String} selectedConstituency Name of Selected Constituency
 * @returns {Array<Object>} - List of selected constituencies with respective winner data
 */
export const getConstituenciesResults = (
  data,
  selectedConstituency,
  electionType,
  groupType,
  partyAlliance
) => {
  let result = []
  if (data.constituencies) {
    if (
      selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT ||
      selectedConstituency === "First Select a State or UT"
    ) {
      data.constituencies.map((d) => {
        if (groupType === "party") {
          if (electionType === "general") {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              party: d.stats[0].party,
              color: d.stats[0].color,
              pc_name: d.PC_NAME
            })
          } else {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              party: d.stats[0].party,
              color: d.stats[0].color,
              ac_name: d.AC_NAME
            })
          }
        } else {
          const alliance = partyAlliance.find(
            (e) => e.PARTY == d.stats[0].party
          )
            ? partyAlliance.find((e) => e.PARTY === d.stats[0].party).ALLIANCE
            : "OTHERS"
          if (electionType === "general") {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              alliance: alliance,
              color:
                PARTY_COLOR.find((e) => e.party == alliance) == undefined
                  ? DEFAULT_PARTY_ALLIANCE_COLOR
                  : PARTY_COLOR.find((e) => e.party == alliance).color,
              pc_name: d.PC_NAME
            })
          } else {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              alliance: alliance,
              color:
                PARTY_COLOR.find((e) => e.party == alliance) == undefined
                  ? DEFAULT_PARTY_ALLIANCE_COLOR
                  : PARTY_COLOR.find((e) => e.party == alliance).color,
              ac_name: d.AC_NAME
            })
          }
        }
      })
    } else {
      data.constituencies.map((d) => {
        if (groupType === "party") {
          if (electionType === "general") {
            d.PC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                party: d.stats[0].party,
                color: d.stats[0].color,
                pc_name: d.PC_NAME
              })
          } else {
            d.AC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                party: d.stats[0].party,
                color: d.stats[0].color,
                ac_name: d.AC_NAME
              })
          }
        } else {
          const alliance = partyAlliance.find(
            (e) => e.PARTY === d.stats[0].party
          )
            ? partyAlliance.find((e) => e.PARTY === d.stats[0].party).ALLIANCE
            : "OTHERS"
          if (electionType === "general") {
            d.PC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                alliance: alliance,
                color:
                  PARTY_COLOR.find((e) => e.party == alliance) == undefined
                    ? DEFAULT_PARTY_ALLIANCE_COLOR
                    : PARTY_COLOR.find((e) => e.party == alliance).color,
                pc_name: d.PC_NAME
              })
          } else {
            d.AC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                alliance: alliance,
                color:
                  PARTY_COLOR.find((e) => e.party == alliance) == undefined
                    ? DEFAULT_PARTY_ALLIANCE_COLOR
                    : PARTY_COLOR.find((e) => e.party == alliance).color,
                ac_name: d.AC_NAME
              })
          }
        }
      })
    }
    return result
  } else {
    return []
  }
}

/**
 * Returns Data for Map as a List of Constituencies in a State/UT and top four candidates in an Array respectively
 * @param {Array<Object>} data - Election Data of a year
 * @param {String} stateUT - Key Name of a State/UT
 * @return {Object} - List of Constituencies in a State/UT and top four candidates in an Array respectively
 */
export const getStateUTMapDataPC = (data, stateUT, electionType) => {
  let stateData = []
  let constituenciesList = new Set()
  stateData =
    stateUT === STATE_UT_DEFAULT_SELECT
      ? data
      : data.filter((row) => row.ST_NAME === stateUT)
  if (electionType === "general") {
    stateData.map((row) => {
      constituenciesList.add(row.PC_NAME)
    })
    let constituencies = [...constituenciesList].map((pc) => {
      let constituencyData = stateData.filter((row) => row.PC_NAME === pc)
      let candidates = new Set()
      constituencyData.map((row) => candidates.add(row.CANDIDATE))
      let constituencyStatsTemp = [...candidates].map((c) => {
        let votesReceived = 0
        let candidate = null
        let party = null
        constituencyData.map((row) => {
          row.CANDIDATE === c &&
            ((candidate = c),
            (party = row.PARTY),
            (votesReceived = votesReceived + parseInt(row.VOTES)))
        })
        return {
          candidate: candidate,
          party: party,
          votesReceived: votesReceived,
          color:
            PARTY_COLOR.find((e) => e.party == party) == undefined
              ? DEFAULT_PARTY_ALLIANCE_COLOR
              : PARTY_COLOR.find((e) => e.party == party).color
        }
      })
      let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
        return (a.votesReceived > b.votesReceived && -1) || 1
      })
      let constituencyStats = []
      constituencyStatsSorted.length < 5 &&
        (constituencyStats = constituencyStatsSorted)
      constituencyStatsSorted.length >= 5 &&
        constituencyStatsSorted.map((row, index) => {
          ;(index < 4 && (constituencyStats[index] = row)) ||
            ((constituencyStats[3].candidate = "OTHERS"),
            (constituencyStats[3].party = "OTHERS"),
            (constituencyStats[3].votesReceived +=
              constituencyStatsSorted[index].votesReceived))
        })
      return { PC_NAME: pc, stats: constituencyStats }
    })
    return {
      stateUT: stateUT,
      constituencies: constituencies
    }
  } else {
    stateData.map((row) => {
      constituenciesList.add(row.AC_NAME)
    })
    let constituencies = [...constituenciesList].map((ac) => {
      let constituencyData = stateData.filter((row) => row.AC_NAME === ac)
      let candidates = new Set()
      constituencyData.map((row) => candidates.add(row.CANDIDATE))
      let constituencyStatsTemp = [...candidates].map((c) => {
        let votesReceived = 0
        let candidate = null
        let party = null
        constituencyData.map((row) => {
          row.CANDIDATE === c &&
            ((candidate = c),
            (party = row.PARTY),
            (votesReceived = votesReceived + parseInt(row.VOTES)))
        })
        return {
          candidate: candidate,
          party: party,
          votesReceived: votesReceived,
          color:
            PARTY_COLOR.find((e) => e.party == party) == undefined
              ? "#000000"
              : PARTY_COLOR.find((e) => e.party == party).color
        }
      })
      let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
        return (a.votesReceived > b.votesReceived && -1) || 1
      })
      let constituencyStats = []
      constituencyStatsSorted.length < 5 &&
        (constituencyStats = constituencyStatsSorted)
      constituencyStatsSorted.length >= 5 &&
        constituencyStatsSorted.map((row, index) => {
          (index < 4 && (constituencyStats[index] = row)) ||
            ((constituencyStats[3].candidate = "OTHERS"),
            (constituencyStats[3].party = "OTHERS"),
            (constituencyStats[3].votesReceived +=
              constituencyStatsSorted[index].votesReceived))
        })
      return { AC_NAME: ac, stats: constituencyStats }
    })
    return {
      stateUT: stateUT,
      constituencies: constituencies
    }
  }
}

/**
 * Convert Number to Indian Decimal System
 * @param {number} x - Number to convert to Indian System
 * @return {number} Number in Indian Place Value System
 */
export const indPlaceVal = (x) => {
  x = x.toString()
  let lastThree = x.substring(x.length - 3)
  let otherNumbers = x.substring(0, x.length - 3)
  if (otherNumbers != "") lastThree = "," + lastThree
  let number = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree
  return number
}
