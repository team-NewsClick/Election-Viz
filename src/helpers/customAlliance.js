import {
  PARTY_ALLIANCE_COLORS,
  DEFAULT_PARTY_ALLIANCE_COLOR,
  ALL_STATE_UT
} from "../constants"

/**
 * To get the list of winnning parties in a state/UT of a election
 * @param {Array<Object>} yearData election data of a selected year and election type
 * @param {String} selectedStateUT State/UT
 * @param {String} electionViewType assembly view or general view of selected election data
 * @returns List of Winnig Parties
 */
export const getWinningParties = (
  yearData,
  selectedStateUT,
  electionViewType
) => {
  let statsData = {},
    parties = new Set()
  const stateUTData =
    selectedStateUT === ALL_STATE_UT
      ? yearData
      : yearData.filter((row) => row.ST_NAME === selectedStateUT)
  if (electionViewType === "general") {
    stateUTData.map((d) => {
      if (statsData[d.ST_NAME] && statsData[d.ST_NAME][d.PC_NO]) {
        statsData[d.ST_NAME][d.PC_NO].push(d)
      } else if (statsData[d.ST_NAME]) {
        statsData[d.ST_NAME][d.PC_NO] = []
        statsData[d.ST_NAME][d.PC_NO].push(d)
      } else {
        statsData[d.ST_NAME] = {}
        statsData[d.ST_NAME][d.PC_NO] = []
        statsData[d.ST_NAME][d.PC_NO].push(d)
      }
    })
  } else {
    stateUTData.map((d) => {
      if (statsData[d.ST_NAME] && statsData[d.ST_NAME][d.AC_NO]) {
        statsData[d.ST_NAME][d.AC_NO].push(d)
      } else if (statsData[d.ST_NAME]) {
        statsData[d.ST_NAME][d.AC_NO] = []
        statsData[d.ST_NAME][d.AC_NO].push(d)
      } else {
        statsData[d.ST_NAME] = {}
        statsData[d.ST_NAME][d.AC_NO] = []
        statsData[d.ST_NAME][d.AC_NO].push(d)
      }
    })
  }
  for (const state in statsData) {
    for (const constituencies in statsData[state]) {
      const tempCandidateStats = statsData[state][constituencies].sort(
        (a, b) => parseInt(b.VOTES) - parseInt(a.VOTES)
      )
      parties.add(tempCandidateStats[0].PARTY)
    }
  }
  parties = [...parties]
  return parties
}

/**
 * To get list of parties for every alliances
 * @param {Array<String>} parties List of winning parties in an election
 * @param {Array<Object>} defaultPartyAlliance List of parties and their respective alliances
 * @returns List of alliances and an array of their respective parties
 */
export const getPartyAlliance = (parties, defaultPartyAlliance) => {
  let alliances = new Set(),
    alliancePartyData = []
  defaultPartyAlliance.map((d) => alliances.add(d.ALLIANCE))
  alliances = [...alliances]
  alliances.map((d) => {
    alliancePartyData.push({
      alliance: d,
      parties: []
    })
  })
  parties.map((d) => {
    let tempAlliance = defaultPartyAlliance.find((p) => p.PARTY === d)
    if (tempAlliance !== undefined) {
      tempAlliance = tempAlliance.ALLIANCE
      const tempIndex = alliancePartyData.findIndex(
        (r) => r.alliance === tempAlliance
      )
      alliancePartyData[tempIndex].parties.push(d)
    } else {
      alliancePartyData.push({
        alliance: d,
        parties: [d]
      })
    }
  })
  alliancePartyData.push({ alliance: "Unaligned", parties: [] })
  alliancePartyData.map((d) => {
    if (d.parties.length === 1) {
      alliancePartyData[alliancePartyData.length - 1].parties.push(
        d.parties.pop()
      )
    }
  })
  alliancePartyData = alliancePartyData.filter((d) => d.parties.length !== 0)
  return alliancePartyData
}

/**
 * To get color of respective parties and alliance from the list of alliances and their belonging parties
 * @param {Array<Object>} rows List of alliances and their belonging parties
 * @returns {Object} Parties & alliances and their respective colors
 */
export const getColorPartyAlliance = (rows) => {
  let colorPartyAlliance = {}
  rows.map((d) => {
    const color = PARTY_ALLIANCE_COLORS[d.alliance]
    if (color) {
      colorPartyAlliance[d.alliance] = color
    } else {
      colorPartyAlliance[d.alliance] = PARTY_ALLIANCE_COLORS[d.parties[0]]
        ? PARTY_ALLIANCE_COLORS[d.parties[0]]
        : DEFAULT_PARTY_ALLIANCE_COLOR
    }
    d.parties.map((party) => {
      colorPartyAlliance[party] = PARTY_ALLIANCE_COLORS[party]
        ? PARTY_ALLIANCE_COLORS[party]
        : DEFAULT_PARTY_ALLIANCE_COLOR
    })
  })
  return colorPartyAlliance
}

/**
 * To get parties and their respective alliance from the list of alliances and their belonging parties
 * @param {Array<Object>} rows List of alliances and their belonging parties
 * @returns {Array<Object>} List of parties and their respective alliances
 */
export const getPartiesAlliancesFromRows = (rows) => {
  let partyAlliance = []
  rows.map((a) => {
    a.alliance !== "Unaligned"
      ? a.parties.map((p) =>
          partyAlliance.push({ PARTY: p, ALLIANCE: a.alliance })
        )
      : a.parties.map((p) => partyAlliance.push({ PARTY: p, ALLIANCE: p }))
  })
  return partyAlliance
}
