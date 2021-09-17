import { PARTY_ALLIANCE_COLORS, DEFAULT_PARTY_ALLIANCE_COLOR, ALL_STATE_UT } from "../constants"

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
  let constituenciesList = new Set(),
    parties = new Set()
  const stateUTData =
    selectedStateUT === ALL_STATE_UT
      ? yearData
      : yearData.filter((row) => row.ST_NAME === selectedStateUT)
  if (electionViewType === "general") {
    stateUTData.map((row) => {
      constituenciesList.add(row.PC_NAME)
    })
    let constituencies = [...constituenciesList]
    constituencies.map((pc) => {
      let constituencyData = stateUTData.filter((row) => row.PC_NAME === pc)
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
          votesReceived: votesReceived
        }
      })
      let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
        return (a.votesReceived > b.votesReceived && -1) || 1
      })
      parties.add(constituencyStatsSorted[0].party)
    })
  } else {
    stateUTData.map((row) => {
      constituenciesList.add(row.AC_NAME)
    })
    let constituencies = [...constituenciesList]
    constituencies.map((ac) => {
      let constituencyData = stateUTData.filter((row) => row.AC_NAME === ac)
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
          votesReceived: votesReceived
        }
      })
      let constituencyStatsSorted = constituencyStatsTemp.sort((a, b) => {
        return (a.votesReceived > b.votesReceived && -1) || 1
      })
      parties.add(constituencyStatsSorted[0].party)
    })
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
    if(tempAlliance !== undefined) {
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
  alliancePartyData.push({alliance: "Unaligned", parties: []})
  alliancePartyData.map((d) => {
    if(d.parties.length === 1) {
      alliancePartyData[alliancePartyData.length - 1].parties.push(d.parties.pop())
    }
  })
  return alliancePartyData
}

export const getColorPartyAlliance = (rows) => {
  let colorPartyAlliance = {}
  rows.map((d) => {
    const color = PARTY_ALLIANCE_COLORS[d.alliance]
    if(color) {
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
