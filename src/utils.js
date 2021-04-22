import { parse } from "postcss"
import { STATE_UT_DEFAULT_SELECT, PARTY_COLOR, CONSTITUENCIES_DEFAULT_SELECT } from "./constants"

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
    if(stateUTs.length > 1){
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
    if(selectedStateUT === STATE_UT_DEFAULT_SELECT) {
      constituencies.add("First Select a State or UT")
    } else {
      data.map((row) => {
        constituencies.add(electionType === "general" ? row.PC_NAME : row.AC_NAME)
      })
    }
    constituencies = [...constituencies]
    if(constituencies.length > 1) {
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
export const dataStateUT = (data, stateUT) => {
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
export const dataConstituency = (data, constituency, electionType) => {
  if (constituency === "All Constituencies") {
    return data
  } else {
    if(electionType === "general") {
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
  return PARTY_COLOR.find((e) => e.party == (data.party || data.alliance)) == undefined
    ? "#000000"
    : PARTY_COLOR.find((e) => e.party == (data.party || data.alliance)).color
}

/**
 *
 * @param {Array} data
 * @returns
 */
export const seatsCount = (data, groupType, partyAlliance) => {
  let preFinal= []
  if(groupType === "party") {
  const partiesCount = data.reduce(
    (acc, o) => ((acc[o.party || o.PARTY] = (acc[o.party || o.PARTY] || 0) + 1), acc),
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
    preFinal = partyData
  } else {
    const alliancesCount = data.reduce(
      (acc, o) => ((acc[o.alliance || o.ALLIANCE] = (acc[o.alliance || o.ALLIANCE] || 0) + 1), acc),
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
    preFinal = allianceData
  }
  const finalData = new Object()
  preFinal.map((row) => {
    finalData[(row.party || row.alliance)] = {
      seats: row.totalSeats,
      colour: assignColor(row)
    }
  })
  return finalData
}

/**
 *
 * @param {Array} data
 * @param {string} electionType
 * @returns
 */
export const getRegionStatsSVGData = (data, electionType, groupType, partyAlliance, selectedStateUT) => {
  if (electionType === 'general') {
    const count = seatsCount(data, groupType)
    return count
  } else {
    if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
      return []
    } else {
      const electedCandidates = getAssemblyResults(data, groupType, partyAlliance)
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
  if(groupType === "party") {
    data.filter((candidates) => (candidates.POSITION === '1')).map((row) => {
      finalData.push(row)
    })
  } else {
    data.filter((candidates) => (candidates.POSITION === '1')).map((row) => {
      const alliance = partyAlliance.find(e => e.PARTY == row.PARTY) ? (partyAlliance.find(e => e.PARTY === row.PARTY)).ALLIANCE : "OTHERS"
      finalData.push({
        candidate: row.CANDIDATE,
        color: PARTY_COLOR.find((e) => e.party == alliance) == undefined
                ? "#000000"
                : PARTY_COLOR.find((e) => e.party == alliance).color,
        alliance: alliance,
        ac_name: row.AC_NAME,
        votes: row.VOTES,
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
export const getConstituenciesResults = (data, selectedConstituency, groupType, partyAlliance) => {
  let result = []
  if(data.parliamentConstituencies){
    if(selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT || selectedConstituency === "First Select a State or UT") {
        data.parliamentConstituencies.map((d) => {
        if(groupType === "party") {
          result.push({  
            votes: d.stats[0].votesReceived,
            candidate: d.stats[0].candidate,
            party: d.stats[0].party,
            color: d.stats[0].color,
            pc_name: d.PC_NAME,
          })
        } else {
          const alliance = partyAlliance.find(e => e.PARTY == d.stats[0].party) ? (partyAlliance.find(e => e.PARTY === d.stats[0].party)).ALLIANCE : "OTHERS" 
          result.push({  
            votes: d.stats[0].votesReceived,
            candidate: d.stats[0].candidate,
            alliance: alliance,
            color: PARTY_COLOR.find((e) => e.party == alliance) == undefined
                    ? "#000000"
                    : PARTY_COLOR.find((e) => e.party == alliance).color,
            pc_name: d.PC_NAME,
          })
        }
        })
    } else {
      data.parliamentConstituencies.map((d) => {
        if(groupType === "party") {
          d.PC_NAME == selectedConstituency && result.push({  
            votes: d.stats[0].votesReceived,
            candidate: d.stats[0].candidate,
            party: d.stats[0].party,
            color: d.stats[0].color,
            pc_name: d.PC_NAME,
          })
        } else {
          const alliance = partyAlliance.find(e => e.PARTY === d.stats[0].party) ? (partyAlliance.find(e => e.PARTY === d.stats[0].party)).ALLIANCE : "OTHERS"
          d.PC_NAME == selectedConstituency && result.push({  
            votes: d.stats[0].votesReceived,
            candidate: d.stats[0].candidate,
            alliance: alliance,
            color: PARTY_COLOR.find((e) => e.party == alliance) == undefined
                    ? "#000000"
                    : PARTY_COLOR.find((e) => e.party == alliance).color,
            pc_name: d.PC_NAME,
          })
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
export const getStateUTMapDataPC = (data, stateUT) => {
  let stateData = []
  let parliamentConstituenciesList = new Set()
  stateData = stateUT === STATE_UT_DEFAULT_SELECT ? data : data.filter((row) => row.ST_NAME === stateUT)
  stateData.map((row) => {
    parliamentConstituenciesList.add(row.PC_NAME)
  })
  let parliamentConstituencies = [...parliamentConstituenciesList].map((pc) => {
    let constituencyData = stateData.filter((row) => row.PC_NAME === pc)
    let candidates = new Set()
    constituencyData.map((row) => candidates.add(row.CANDIDATE))
    let constituencyStatsTemp = [...candidates].map((c) => {
      let votesReceived = 0
      let candidate = null
      let party = null
      constituencyData.map((row) => {
        row.CANDIDATE === c && (
          candidate = c,
          party = row.PARTY,
          votesReceived = votesReceived + parseInt(row.VOTES)
        )
      })
      return {
        candidate: candidate,
        party: party,
        votesReceived: votesReceived,
        color: PARTY_COLOR.find((e) => e.party == party) == undefined
                ? "#000000"
                : PARTY_COLOR.find((e) => e.party == party).color
      }
    })
    let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
      return a.votesReceived > b.votesReceived && -1 || 1
    })
    let constituencyStats = []
    constituencyStatsSorted.length < 5 && (constituencyStats = constituencyStatsSorted)
    constituencyStatsSorted.length >= 5 && constituencyStatsSorted.map((row, index) => {
        index < 4 && (constituencyStats[index] = row) || (
          constituencyStats[3].candidate = "Others",
          constituencyStats[3].party = "Others",
          constituencyStats[3].votesReceived += constituencyStatsSorted[index].votesReceived
        )
      })
    return { PC_NAME: pc, stats: constituencyStats }
  })
  return {
    stateUT: stateUT,
    parliamentConstituencies: parliamentConstituencies
  }
}
