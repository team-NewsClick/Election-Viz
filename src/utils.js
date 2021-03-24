import { parse } from "postcss"
import { stateUTDefaultSelect, partyColor } from "./constants"

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
    stateUTs.add("All States & UTs")
    data.map((row) => {
      stateUTs.add(row.ST_NAME)
    })
    return [...stateUTs]
  }
}

/**
 * Returns a list of constituencies of a State/UT
 * @param {Array.<Object>} data - Data of a State/UT's election of a year
 * @return {Array} List of Constituencies in a State/UT
 */
export const getConstituencies = (data) => {
  if (data === null) {
    return null
  } else {
    let constituencies = new Set()
    constituencies.add("All Constituencies")
    data.map((row) => {
      constituencies.add(row.PC_NAME)
    })
    return [...constituencies]
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
export const dataConstituency = (data, constituency) => {
  if (constituency === "All Constituencies") {
    return data
  } else {
    return data.filter((row) => {
      return row.PC_NAME === constituency
    })
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
        votesReceived: votes,
      })
    })
    stats.map((row) => {
      totalParties = row.party !== "IND" ? totalParties + 1 : totalParties + 0
    })
    let totalStats = {
      candidates: candidates.length,
      parties: totalParties,
      alliances: "--",
      votes: totalVotes,
    }
    let highest = 0
    stats.map((d) => {
      highest = d.votesReceived > highest ? d.votesReceived : highest
    })
    stats.map((d) => {
      return d.votesReceived === highest ? d.status = "won" : d.status = "lost"
    })
    return ({ stats, totalStats })
  } else return null
}

export const getRegionStatsSVGData = (data) => {
  let pc_list = new Set()
  let candidate = new Set()
  let total_parties = new Set()
  data.map((row) => {
    pc_list.add(row.PC_NO)
    candidate.add(row.CANDIDATE)
    total_parties.add(row.PARTY)
  })
  pc_list = [...pc_list]
  candidate = [...candidate]
  total_parties = [...total_parties]
  const finalList = getConstituencyResults(data,candidate,pc_list)
  const partiesCount = finalList.reduce( (acc, o) => (acc[o.party] = (acc[o.party] || 0)+1, acc), {} )
  let keys = Object.keys(partiesCount)
  const preFinal = []
  keys.map((key) => {
    let values = {
      party: key,
      totalSeats: partiesCount[key]
    }
  preFinal.push(values)
  })

  const finalData = new Object()
  preFinal.map((row) => {
    finalData[row.party] = {
      seats : row.totalSeats,
      colour: partyColor.find(e => e.party == row.party) == undefined ? "#000000" : partyColor.find(e => e.party == row.party).color
    }
  })
  return finalData
}

/**
 * Returns Data for Map as a List of Constituencies in a State/UT and top four candidates in an Array respectively
 * @param {Array<Object>} data - Election Data of a year
 * @param {Array} Candidate - Candidates List
 * @param {Array} pc_list - Parliamentary Constituency list
 * @return {Object} - List of Constituencies with respective party who won the election
 */
export const getConstituencyResults = (data,candidates,pc_list) => {
  let candidateVotes = []
  candidates.map((cand) => {
    let votes = 0
    let party = '--'
    let pc_no = 0
    data.map((da) => {
      if (da.CANDIDATE === cand){
        votes = votes+parseInt(da.VOTES)
        party = da.PARTY
        pc_no = da.PC_NO
      }
    })
    candidateVotes.push({
      pc_no : pc_no,
      party:party,
      Votes: votes,
      candidate: cand
    })
  })
  let finalList = []
  pc_list.map((pc) => {
    let highest = 0
    candidateVotes.map((ex) => {
      if (pc === ex.pc_no) {
        highest = ex.Votes > highest ? ex.Votes : highest
      }
    })
  const electedCandidates = candidateVotes.find((ele) => {
      return ele.Votes === highest 
    })
    finalList.push(electedCandidates)
  })
return finalList
}

/**
 * Returns Data for Map as a List of Constituencies in a State/UT and top four candidates in an Array respectively
 * @param {Array<Object>} data - Election Data of a year
 * @param {String} stateUT - Key Name of a State/UT
 * @return {Object} - List of Constituencies in a State/UT and top four candidates in an Array respectively
 */
export const getStateUTMapDataPC = (data, stateUT) => {
  if (stateUT === stateUTDefaultSelect) {
    return null
  }
  let stateData = []
  let parliamentConstituenciesList = new Set()
  stateData = data.filter((row) => row.ST_NAME === stateUT)
  stateData.map((row) => {
    parliamentConstituenciesList.add(row.PC_NAME)
  });
  let parliamentConstituencies = [...parliamentConstituenciesList].map((pc) => {
    let constituencyData = stateData.filter((row) => row.PC_NAME == pc)
    let candidates = new Set()
    constituencyData.map((row) => candidates.add(row.CANDIDATE));
    let constituencyStatsTemp = [...candidates].map((c) => {
      let votesReceived = 0
      let candidate = null
      let party = null
      constituencyData.map((row) => {
        if (row.CANDIDATE === c) {
          candidate = c
          party = row.PARTY
          votesReceived = votesReceived + parseInt(row.VOTES)
        }
      })
      return {
        candidate: candidate,
        party: party,
        votesReceived: votesReceived,
      }
    })
    let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
      const A = a.votesReceived
      const B = b.votesReceived
      let comparison = 0;
      if (A > B) {
        comparison = -1;
      } else if (A < B) {
        comparison = 1;
      }
      return comparison;
    })
    let constituencyStats = []
    if (constituencyStatsSorted.length < 5) {
      constituencyStats = constituencyStatsSorted
    } else {
      constituencyStatsSorted.map((row, index) => {
        index < 4
          ? constituencyStats[index] = row
          : (constituencyStats[3].candidate = "Others",
            constituencyStats[3].party = "Others",
            constituencyStats[3].votesReceived = 0 + constituencyStatsSorted[index].votesReceived)
      })
    }
    return ({ PC_NAME: pc, stats: constituencyStats })
  })
  return { stateUT: stateUT, parliamentConstituencies: parliamentConstituencies }
}
