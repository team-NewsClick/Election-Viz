import {
  STATE_UT_DEFAULT_SELECT,
  PARTY_COLOR,
  CONSTITUENCIES_DEFAULT_SELECT,
  DEFAULT_PARTY_ALLIANCE_COLOR,
  ELECTION_YEAR_STATEUT,
  FIRST_SELECT_STATEUT,
  STATE_UT_LIST,
  SELECT_STATE_UT,
  SELECT_ELECTION,
  NO_CONSTITUENCIES
} from "../constants"

/**
 * Returns a list of States and UTs that had election in a year for the dropdown list
 * @param {Array.<Object>} data - Array of Objects having a year of data
 * @return {Array} List of States and UTS that had election in a year
 */
export const getStateUTs = (selectedElection, seatType, electionViewType, geoJSON) => {
  let tempStates =[]
  let year = selectedElection.year
  let election = selectedElection.type
  if (geoJSON.features && geoJSON.features.length !== 0) {
    let stateUTFromData = new Set(), stateUTFromGeoJson = new Set(), stateUTs = []
    if (electionViewType === "general") {
      stateUTFromData = [...ELECTION_YEAR_STATEUT[electionViewType][year]]
    } else {
      if(selectedElection === (SELECT_ELECTION || undefined)) {
        tempStates = STATE_UT_LIST
        tempStates.unshift(SELECT_STATE_UT)
      } else {
          tempStates = ELECTION_YEAR_STATEUT[election][year]
          tempStates.unshift(SELECT_STATE_UT)
      }
      tempStates.map((d) => stateUTFromData.add(d))
      stateUTFromData = [...stateUTFromData]
    }
    if(seatType === "Reserved") {
      geoJSON.features.map((d) => {
        if(d.properties.Res !== "GEN") stateUTFromGeoJson.add(d.properties.ST_NAME)
      })
    } else if(seatType === "Unreserved") {
      geoJSON.features.map((d) => {
        if(d.properties.Res === "GEN") stateUTFromGeoJson.add(d.properties.ST_NAME)
      })
    } else {
      geoJSON.features.map((d) => stateUTFromGeoJson.add(d.properties.ST_NAME))
    }
    if(electionViewType === "general") {
      stateUTFromGeoJson = [...stateUTFromGeoJson]
      stateUTs.push(STATE_UT_DEFAULT_SELECT)
      stateUTFromData.map((d) => {
        if(stateUTFromGeoJson.findIndex((e) => e === d) > -1) stateUTs.push(d)
      })
      if (stateUTs.length === 2) {
        stateUTs.shift()
      }
    } else {
      stateUTs = stateUTFromData
    }
    return stateUTs
  }
}

export const getElectionOptions = (electionViewType, selectedStateUT, selectedElection) => {
  let electionOptions = []
  if(electionViewType === "general") {
    for(const ELECTION in ELECTION_YEAR_STATEUT) {
      if(ELECTION === electionViewType) {
        for(const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
          let tempValue = {type: ELECTION, year: YEAR}
          let tempLabel = ELECTION + " Election " + YEAR
          tempLabel = tempLabel.charAt(0).toUpperCase() +tempLabel.slice(1)
          electionOptions.push({
            value: tempValue,
            label: tempLabel
          })
        }
      }
    }
  } else {
    if(selectedElection !== SELECT_ELECTION && (selectedStateUT !== SELECT_STATE_UT || selectedStateUT === STATE_UT_DEFAULT_SELECT)) {
      for(const ELECTION in ELECTION_YEAR_STATEUT) {
        for(const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
          const tempStates = ELECTION_YEAR_STATEUT[ELECTION][YEAR]
          if(tempStates.findIndex((d) => d === selectedStateUT) > -1) {
            let tempValue = {type: ELECTION, year: YEAR}
            let tempLabel = ELECTION + " Election " + YEAR
            tempLabel = tempLabel.charAt(0).toUpperCase() +tempLabel.slice(1)
            electionOptions.push({
              value: tempValue,
              label: tempLabel
            })
          }
        }
      }
    } else {
      for(const ELECTION in ELECTION_YEAR_STATEUT) {
        for(const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
          const tempStates = ELECTION_YEAR_STATEUT[ELECTION][YEAR]
            let tempValue = {type: ELECTION, year: YEAR}
            let tempLabel = ELECTION + " Election " + YEAR
            tempLabel = tempLabel.charAt(0).toUpperCase() +tempLabel.slice(1)
            electionOptions.push({
              value: tempValue,
              label: tempLabel
            })
        }
      }
    }
    electionOptions.push({
      value: SELECT_ELECTION,
      label: SELECT_ELECTION
    })
  }
  electionOptions = electionOptions.reverse()
  return electionOptions
}

/**
 * Returns a list of constituencies of a State/UT for the dropdown list
 * @param {Array.<Object>} data - Data of a State/UT's election of a year
 * @return {Array} List of Constituencies in a State/UT
 */
export const getConstituencies = (
  data,
  selectedStateUT,
  electionViewType,
  filteredGeoJSON
) => {
  let constituencies = new Set()
  if (data === null) {
    return null
  } else {
    if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
      return [FIRST_SELECT_STATEUT]
    } else {
      if (electionViewType === "general") {
        data.map((row) => {
          if (
            ("filteredGeoJSON: ",
            filteredGeoJSON.features &&
              filteredGeoJSON.features.findIndex(
                (e) => e.properties.PC_NAME === row.PC_NAME
              ) > -1)
          ) {
            constituencies.add(row.PC_NAME)
          }
        })
      } else {
        data.map((row) => {
          if (
            filteredGeoJSON.features &&
            filteredGeoJSON.features.findIndex(
              (e) => e.properties.AC_NAME === row.AC_NAME
            ) > -1
          ) {
            constituencies.add(row.AC_NAME)
          }
        })
      }
    }
    constituencies = [...constituencies]
    if (constituencies.length > 1) {
      constituencies.unshift(CONSTITUENCIES_DEFAULT_SELECT)
    }
    if(constituencies.length === 0) {
      constituencies.push(NO_CONSTITUENCIES)
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
  if (stateUT === "All States & UTs") {
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
export const getDataConstituency = (data, constituency, electionViewType) => {
  if (constituency === "All Constituencies") {
    return data
  } else {
    if (electionViewType === "general") {
      return data.filter((row) => {
        return row.PC_NAME === constituency
      })
    } else {
      return (
        data &&
        data.filter((row) => {
          return row.AC_NAME === constituency
        })
      )
    }
  }
}

/**
 * To get ist of elections that was held for the selected State or UT for dropdown menu
 * @param {String} electionViewType general or assembly
 * @param {String} selectedElection year of election
 * @param {String} selectedStateUT Name of State or UT
 * @returns {Array<Object>} List of elections for the selected
 */
export const getCompareOptions = (selectedElection, selectedStateUT) => {
  const electionType = selectedElection.type
  const selectedYear = selectedElection.year
  const compareOptions = [{
    value: {type: "none", year: "none"},
    label: "None"
  }]
  if(selectedStateUT === SELECT_STATE_UT || selectedElection === SELECT_ELECTION) {
    return compareOptions
  }
  if(electionType ==="general" && selectedStateUT === STATE_UT_DEFAULT_SELECT) {
    for(const ELECTION in ELECTION_YEAR_STATEUT) {
      for(const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
        if(ELECTION === electionType && YEAR !== selectedYear) {
          let tempValue = {type: ELECTION, year: YEAR}
          let tempLabel = ELECTION + " Election " + YEAR
          tempLabel = tempLabel.charAt(0).toUpperCase() +tempLabel.slice(1)
          compareOptions.push({
            value: tempValue,
            label: tempLabel
          })
        }
      }
    }
  } else {
    for(const ELECTION in ELECTION_YEAR_STATEUT) {
      for(const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
        if(electionType !== ELECTION || selectedYear !== YEAR) {
          ELECTION_YEAR_STATEUT[ELECTION][YEAR].map((STATE_UT) => {
            if(selectedStateUT === STATE_UT) {
              let tempValue = {type: ELECTION, year: YEAR}  
              let tempLabel = ELECTION + " Election " + YEAR
              tempLabel = tempLabel.charAt(0).toUpperCase() +tempLabel.slice(1)
              compareOptions.push({
                value: tempValue,
                label: tempLabel
              })
            }
          })
        }
      }
    }
  }
  return compareOptions
}

/**
 * Find Party color
 * @param {*} data - Array of Party and Total Seats
 * @returns - Hex Color
 */
export const assignColor = (data) => {
  return PARTY_COLOR.find((e) => e.party == (data.party || data.alliance)) ==
    undefined
    ? DEFAULT_PARTY_ALLIANCE_COLOR
    : PARTY_COLOR.find((e) => e.party == (data.party || data.alliance)).color
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
      return d.votesReceived === highest
        ? (d.status = "won")
        : (d.status = "lost")
    })
    return { stats, totalStats }
  } else return null
}

/**
 * List of Constituencies and their winning candidates data
 * @param {Object} data {StateUT, PC_NAME, Top 4 contestants}
 * @param {String} selectedConstituency Name of Selected Constituency
 * @returns {Array<Object>} - List of selected constituencies with respective winner data
 */
export const getConstituenciesResults = (
  data,
  selectedConstituency,
  electionViewType,
  groupType,
  partyAlliance
) => {
  let result = []
  if (data.constituencies) {
    if (
      selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT ||
      selectedConstituency === FIRST_SELECT_STATEUT
    ) {
      data.constituencies.map((d) => {
        if (groupType === "party") {
          if (electionViewType === "general") {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              party: d.stats[0].party,
              color: d.stats[0].color,
              pc_name: d.PC_NAME,
            })
          } else {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              party: d.stats[0].party,
              color: d.stats[0].color,
              ac_name: d.AC_NAME,
            })
          }
        } else {
          const alliance = partyAlliance.find(
            (e) => e.PARTY == d.stats[0].party
          )
            ? partyAlliance.find((e) => e.PARTY === d.stats[0].party).ALLIANCE
            : "OTHERS"
          if (electionViewType === "general") {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              alliance: alliance,
              party: d.stats[0].party,
              color:
                PARTY_COLOR.find((e) => e.party == alliance) == undefined
                  ? DEFAULT_PARTY_ALLIANCE_COLOR
                  : PARTY_COLOR.find((e) => e.party == alliance).color,
              pc_name: d.PC_NAME,
            })
          } else {
            result.push({
              votes: d.stats[0].votesReceived,
              candidate: d.stats[0].candidate,
              alliance: alliance,
              party: d.stats[0].party,
              color:
                PARTY_COLOR.find((e) => e.party == alliance) == undefined
                  ? DEFAULT_PARTY_ALLIANCE_COLOR
                  : PARTY_COLOR.find((e) => e.party == alliance).color,
              ac_name: d.AC_NAME,
            })
          }
        }
      })
    } else {
      data.constituencies.map((d) => {
        if (groupType === "party") {
          if (electionViewType === "general") {
            d.PC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                party: d.stats[0].party,
                color: d.stats[0].color,
                pc_name: d.PC_NAME,
              })
          } else {
            d.AC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                party: d.stats[0].party,
                color: d.stats[0].color,
                ac_name: d.AC_NAME,
              })
          }
        } else {
          const alliance = partyAlliance.find(
            (e) => e.PARTY === d.stats[0].party
          )
            ? partyAlliance.find((e) => e.PARTY === d.stats[0].party).ALLIANCE
            : "OTHERS"
          if (electionViewType === "general") {
            d.PC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                alliance: alliance,
                party: d.stats[0].party,
                color:
                  PARTY_COLOR.find((e) => e.party == alliance) == undefined
                    ? DEFAULT_PARTY_ALLIANCE_COLOR
                    : PARTY_COLOR.find((e) => e.party == alliance).color,
                pc_name: d.PC_NAME,
              })
          } else {
            d.AC_NAME == selectedConstituency &&
              result.push({
                votes: d.stats[0].votesReceived,
                candidate: d.stats[0].candidate,
                alliance: alliance,
                party: d.stats[0].party,
                color:
                  PARTY_COLOR.find((e) => e.party == alliance) == undefined
                    ? DEFAULT_PARTY_ALLIANCE_COLOR
                    : PARTY_COLOR.find((e) => e.party == alliance).color,
                ac_name: d.AC_NAME,
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
export const getMapData = (data, stateUT, electionViewType) => {
  let stateData = []
  let constituenciesList = new Set()
  stateData =
    stateUT === STATE_UT_DEFAULT_SELECT
      ? data
      : data.filter((row) => row.ST_NAME === stateUT)
  if (electionViewType === "general") {
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
              : PARTY_COLOR.find((e) => e.party == party).color,
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
      constituencies: constituencies,
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
              ? DEFAULT_PARTY_ALLIANCE_COLOR
              : PARTY_COLOR.find((e) => e.party == party).color,
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
      return { AC_NAME: ac, stats: constituencyStats }
    })
    return {
      stateUT: stateUT,
      constituencies: constituencies,
    }
  }
}
