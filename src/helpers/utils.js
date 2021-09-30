import {
  ALL_STATE_UT,
  ALL_CONSTITUENCIES,
  ELECTION_YEAR_STATEUT,
  FIRST_SELECT_STATEUT,
  STATE_UT_LIST,
  SELECT_STATE_UT,
  SELECT_ELECTION,
  NO_CONSTITUENCIES,
  LIVE_ELECTION,
  LIVE_ELECTION_TYPE,
  STATE_COLORS,
  UPCOMING_ELECTION,
  CSV_PATH,
  UPCOMING_ELECTION_TYPE,
  UPCOMING_ELECTION_YEAR
} from "../constants"

/**
 * Returns a list of States and UTs that had election in a year for the dropdown list
 * @param {Object} selectedElection Selected election: {type: "assembly"/"general", year: "year"}
 * @param {String} seatType Selected seat type: All Seats/Reserve/Unreserved
 * @param {String} electionViewType general or assembly
 * @param {GeoJSON} geoJSON Constituencies geojson
 * @return {Array} List of States and UTS that had election in a year
 */
export const getStateUTs = (
  selectedElection,
  seatType,
  electionViewType,
  geoJSON
) => {
  let tempStates = [],
    year,
    election
  if (selectedElection === LIVE_ELECTION) {
    year = LIVE_ELECTION
    election = LIVE_ELECTION_TYPE
  } else {
    year = selectedElection.year
    election = selectedElection.type
  }
  if (geoJSON.features && geoJSON.features.length !== 0) {
    let stateUTFromData = new Set(),
      stateUTFromGeoJson = new Set(),
      stateUTs = []
    if (electionViewType === "general") {
      stateUTFromData = [...ELECTION_YEAR_STATEUT[electionViewType][year]]
    } else {
      if (selectedElection === (SELECT_ELECTION || undefined)) {
        tempStates = STATE_UT_LIST
        tempStates.unshift(SELECT_STATE_UT)
      } else {
        tempStates = ELECTION_YEAR_STATEUT[election][year]
        tempStates.unshift(SELECT_STATE_UT)
      }
      tempStates.map((d) => stateUTFromData.add(d))
      stateUTFromData = [...stateUTFromData]
    }
    switch (seatType) {
      case "Reserved":
        geoJSON.features.map((d) => {
          if (d.properties.RES !== "GEN")
            stateUTFromGeoJson.add(d.properties.ST_NAME)
        })
        break
      case "Unreserved":
        geoJSON.features.map((d) => {
          if (d.properties.RES === "GEN")
            stateUTFromGeoJson.add(d.properties.ST_NAME)
        })
        break
      default:
        geoJSON.features.map((d) =>
          stateUTFromGeoJson.add(d.properties.ST_NAME)
        )
    }
    if (electionViewType === "general") {
      stateUTFromGeoJson = [...stateUTFromGeoJson]
      stateUTs.push(ALL_STATE_UT)
      stateUTFromData.map((d) => {
        if (stateUTFromGeoJson.findIndex((e) => e === d) > -1) stateUTs.push(d)
      })
      if (stateUTs.length === 2) stateUTs.shift()
    } else {
      stateUTs = stateUTFromData
    }
    return stateUTs
  }
}

/**
 * Color for selectable States & UTs in assembly election
 * @param {Array<String>} stateUTs List of States & UTs
 * @param {Object} selectedElection Selected election: {type: "assembly"/"general", year: "year"}
 * @returns {Array<Object>} Color for selectable States & UTs in assembly election
 */
export const getInitalStateUTcolors = (stateUTs, selectedElection) => {
  if (selectedElection.type === "assembly") {
    const stateColor = stateUTs.map((d, i) => {
      if (d !== SELECT_STATE_UT) return { state: d, color: STATE_COLORS[i] }
    })
    return stateColor
  }
}

/**
 * List of elections to be selected
 * @param {String} electionViewType assembly/general
 * @param {String} selectedStateUT Name of selected state/UT
 * @param {Object} selectedElection Selected election: {type: "assembly"/"general", year: "year"}
 * @returns {Array<Object>} List of elections to be selected
 */
export const getElectionOptions = (
  electionViewType,
  selectedStateUT,
  selectedElection
) => {
  let electionOptions = []
  if (electionViewType === "general") {
    for (const ELECTION in ELECTION_YEAR_STATEUT) {
      if (ELECTION === electionViewType) {
        for (const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
          if (YEAR === LIVE_ELECTION) {
            let tempValue = LIVE_ELECTION
            let tempLabel = LIVE_ELECTION
            electionOptions.push({
              value: tempValue,
              label: tempLabel
            })
          } else {
            let tempValue = { type: ELECTION, year: YEAR }
            let tempLabel = ELECTION + " Election " + YEAR
            tempLabel = tempLabel.charAt(0).toUpperCase() + tempLabel.slice(1)
            electionOptions.push({
              value: tempValue,
              label: tempLabel
            })
          }
        }
      }
    }
  } else {
    if (
      selectedElection !== SELECT_ELECTION &&
      (selectedStateUT !== SELECT_STATE_UT || selectedStateUT === ALL_STATE_UT)
    ) {
      for (const ELECTION in ELECTION_YEAR_STATEUT) {
        for (const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
          const tempStates = ELECTION_YEAR_STATEUT[ELECTION][YEAR]
          if (
            tempStates.findIndex((d) => d === selectedStateUT) > -1 &&
            YEAR !== UPCOMING_ELECTION
          ) {
            let tempValue = { type: ELECTION, year: YEAR }
            let tempLabel = ELECTION + " Election " + YEAR
            tempLabel = tempLabel.charAt(0).toUpperCase() + tempLabel.slice(1)
            electionOptions.push({
              value: tempValue,
              label: tempLabel
            })
          }
        }
      }
    } else {
      for (const ELECTION in ELECTION_YEAR_STATEUT) {
        for (const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
          if (YEAR !== LIVE_ELECTION) {
            let tempValue = { type: ELECTION, year: YEAR }
            let tempLabel = ELECTION + " Election " + YEAR
            tempLabel = tempLabel.charAt(0).toUpperCase() + tempLabel.slice(1)
            electionOptions.push({
              value: tempValue,
              label: tempLabel
            })
          }
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
 * URL/path to the selected election file
 * @param {String} electionViewType assembly/general
 * @param {String} electionType selected election type assembly/general
 * @param {String} year Selected election year
 * @returns URL/path to the selected election file
 */
export const getElectionURL = (electionViewType, electionType, year) => {
  let electionURL
  switch (year) {
    case LIVE_ELECTION:
      electionURL = `${process.env.LIVE_ELECTION}`
      break
    case UPCOMING_ELECTION:
      electionURL = `${CSV_PATH}/${electionViewType}/${UPCOMING_ELECTION_TYPE}_${UPCOMING_ELECTION_YEAR}.csv`
      break
    default:
      electionURL = `${CSV_PATH}/${electionViewType}/${electionType}_${year}.csv`
  }
  return electionURL
}

/**
 * Returns a list of constituencies of a State/UT for the dropdown list
 * @param {Array.<Object>} data - Data of a State/UT's election of a year
 * @param {String} selectedStateUT Name of selected state/UT
 * @param {String} electionViewType assembly/general
 * @param {GeoJSON} filteredGeoJSON - Filtered GeoJson
 * @return {Array} List of Constituencies and their code in a State/UT
 */
export const getConstituencies = (
  data,
  selectedStateUT,
  electionViewType,
  filteredGeoJSON
) => {
  let constituencies = {}
  if (data === null) {
    return null
  } else {
    if (selectedStateUT === ALL_STATE_UT) {
      return [{ name: FIRST_SELECT_STATEUT, code: FIRST_SELECT_STATEUT }]
    } else {
      if (electionViewType === "general") {
        data.map((row) => {
          if (
            filteredGeoJSON.features &&
            filteredGeoJSON.features.findIndex(
              (e) => e.properties.PC_NO == row.PC_NO
            ) > -1
          ) {
            constituencies[row.PC_NAME] = row.PC_NO
          }
        })
      } else {
        data.map((row) => {
          if (
            filteredGeoJSON.features &&
            filteredGeoJSON.features.findIndex(
              (e) => e.properties.AC_NO == row.AC_NO
            ) > -1
          ) {
            constituencies[row.AC_NAME] = row.AC_NO
          }
        })
      }
    }
    const tempConstituencies = []
    for (const constituency in constituencies) {
      tempConstituencies.push({
        name: constituency,
        code: constituencies[constituency]
      })
    }
    constituencies = tempConstituencies
    constituencies.length > 1 &&
      constituencies.unshift({
        name: ALL_CONSTITUENCIES,
        code: ALL_CONSTITUENCIES
      })
    constituencies.length === 0 &&
      constituencies.unshift({
        name: NO_CONSTITUENCIES,
        code: NO_CONSTITUENCIES
      })
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
  return stateUT === "All States & UTs"
    ? data
    : data.filter((row) => row.ST_NAME === stateUT)
}

/**
 * To get list of comparable elections
 * @param {String} electionViewType general or assembly
 * @param {Object} selectedElection Selected election: {type: "assembly"/"general", year: "year"}
 * @param {String} selectedStateUT Name of State or UT
 * @returns {Array<Object>} List of comparable elections
 */
export const getCompareOptions = (
  electionViewType,
  selectedElection,
  selectedStateUT
) => {
  const electionType = selectedElection.type
  const selectedYear = selectedElection.year
  const compareOptions = [
    { value: { type: "none", year: "none" }, label: "None" }
  ]
  if (
    selectedStateUT === SELECT_STATE_UT ||
    selectedElection === SELECT_ELECTION
  )
    return compareOptions
  if (electionViewType === "general") {
    for (const ELECTION in ELECTION_YEAR_STATEUT) {
      for (const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
        if (
          ELECTION === electionType &&
          YEAR !== (selectedYear || UPCOMING_ELECTION || LIVE_ELECTION)
        ) {
          let tempValue = { type: ELECTION, year: YEAR }
          let tempLabel = ELECTION + " Election " + YEAR
          tempLabel = tempLabel.charAt(0).toUpperCase() + tempLabel.slice(1)
          compareOptions.push({ value: tempValue, label: tempLabel })
        }
      }
    }
  } else {
    for (const ELECTION in ELECTION_YEAR_STATEUT) {
      for (const YEAR in ELECTION_YEAR_STATEUT[ELECTION]) {
        if (electionType !== ELECTION || selectedYear !== YEAR) {
          ELECTION_YEAR_STATEUT[ELECTION][YEAR].map((STATE_UT) => {
            if (
              selectedStateUT === STATE_UT &&
              YEAR !== (UPCOMING_ELECTION || LIVE_ELECTION)
            ) {
              let tempValue = { type: ELECTION, year: YEAR }
              let tempLabel = ELECTION + " Election " + YEAR
              tempLabel = tempLabel.charAt(0).toUpperCase() + tempLabel.slice(1)
              compareOptions.push({ value: tempValue, label: tempLabel })
            }
          })
        }
      }
    }
  }
  return compareOptions
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
    data.map((row) => candidates.add(row.CANDIDATE))
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
    stats.map(
      (row) =>
        (totalParties =
          row.party !== "IND" ? totalParties + 1 : totalParties + 0)
    )
    let totalStats = {
      candidates: candidates.length,
      parties: totalParties,
      alliances: "--",
      votes: totalVotes
    }
    let highest = 0
    stats.map(
      (d) => (highest = d.votesReceived > highest ? d.votesReceived : highest)
    )
    stats.map((d) => {
      return d.votesReceived === highest
        ? (d.status = "won")
        : (d.status = "lost")
    })
    return { stats, totalStats }
  } else return null
}
