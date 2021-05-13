import {
  STATE_UT_DEFAULT_SELECT,
  CONSTITUENCIES_DEFAULT_SELECT
} from "../constants"

import {
  getConstituenciesResults,
  getDataConstituency,
  getStateUTMapDataPC,
  getDataStateUT
} from "./utils"

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
export const getRegionStatsTable = (
  presentYearData,
  SVGData,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency,
  prevYearData,
  stateUTMapDataConstituencies
) => {
  let tableData = []
  if (prevYearData) {
    const presentYearDataTable = getCurrYearDataTable(
      presentYearData,
      SVGData,
      electionType,
      groupType,
      partyAlliance,
      selectedStateUT,
      selectedConstituency
    )
    const prevYearDataTable = getPrevYearDataTable(
      prevYearData,
      SVGData,
      electionType,
      groupType,
      partyAlliance,
      selectedStateUT,
      selectedConstituency,
      stateUTMapDataConstituencies
    )
    presentYearDataTable &&
      prevYearDataTable &&
      presentYearDataTable.map((d, index) => {
        if (groupType === "party") {
          tableData.push({
            party: d.party,
            seats: d.seats,
            seatsDiff:
              parseInt(d.seats) - parseInt(prevYearDataTable[index].seats),
            votes: d.votes,
            votesPercent: d.votesPercent,
            votesPercentDiff: (
              parseFloat(d.votesPercent) -
              parseFloat(prevYearDataTable[index].votesPercent)
            ).toFixed(2)
          })
        } else {
          tableData.push({
            alliance: d.alliance,
            seats: d.seats,
            seatsDiff:
              parseInt(d.seats) - parseInt(prevYearDataTable[index].seats),
            votes: d.votes,
            votesPercent: d.votesPercent,
            votesPercentDiff: (
              parseFloat(d.votesPercent) -
              parseFloat(prevYearDataTable[index].votesPercent)
            ).toFixed(2)
          })
        }
      })
    return tableData
  }
}

const getCurrYearDataTable = (
  data,
  SVGData,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency
) => {
  let totalVotes = 0
  let tableData = []
  if (
    selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT ||
    selectedStateUT === STATE_UT_DEFAULT_SELECT
  ) {
    if (groupType === "party") {
      for (const property in SVGData) {
        tableData.push({
          party: `${property}`,
          seats: `${SVGData[property].seats}`,
          votes: 0,
          votesPercent: 0
        })
      }
      if (
        tableData.indexOf(tableData.find(({ party }) => party == "OTHERS")) < 0
      ) {
        tableData.push({
          party: "OTHERS",
          seats: 0,
          votes: 0,
          votesPercent: 0
        })
      }
    } else {
      for (const property in SVGData) {
        tableData.push({
          alliance: `${property}`,
          seats: `${SVGData[property].seats}`,
          votes: 0,
          votesPercent: 0
        })
      }
      if (
        tableData.indexOf(
          tableData.find(({ alliance }) => alliance == "OTHERS")
        ) < 0
      ) {
        tableData.push({
          alliance: "OTHERS",
          seats: 0,
          votes: 0,
          votesPercent: 0
        })
      }
    }
    if (groupType === "party") {
      data.map((d) => {
        let temp = tableData.indexOf(
          tableData.find(({ party }) => party == d.PARTY)
        )
        if (temp > -1) {
          tableData[temp].votes += parseInt(d.VOTES)
        } else {
          parseInt(d.VOTES) &&
            tableData[tableData.length - 1] &&
            (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
        }
      })
    } else {
      data.map((d) => {
        let temp =
          partyAlliance.find((e) => e.PARTY == d.PARTY) &&
          tableData.indexOf(
            tableData.find(
              ({ alliance }) =>
                alliance ==
                partyAlliance.find((e) => e.PARTY == d.PARTY).ALLIANCE
            )
          )
        if (temp > -1) {
          tableData[temp].votes += parseInt(d.VOTES)
        } else {
          parseInt(d.VOTES) &&
            tableData[tableData.length - 1] &&
            (tableData[tableData.length - 1].votes += parseInt(d.VOTES))
        }
      })
    }
  } else {
    let constituencyStats = []
    if (electionType === "general") {
      if (data.find((c) => c.PC_NAME == selectedConstituency)) {
        constituencyStats = data.find(
          (c) => c.PC_NAME == selectedConstituency
        ).stats
      }
    } else {
      if (data.find((c) => c.AC_NAME == selectedConstituency)) {
        constituencyStats = data.find(
          (c) => c.AC_NAME == selectedConstituency
        ).stats
      }
    }
    if (groupType === "party") {
      constituencyStats.map((d, index) =>
        tableData.push({
          party: d.party,
          seats: index == 0 ? 1 : 0,
          votes: d.votesReceived,
          votesPercent: 0
        })
      )
    } else {
      let alliances = new Set()
      constituencyStats.map((d) => {
        partyAlliance.find((e) => e.PARTY == d.party)
          ? alliances.add(
              partyAlliance.find((e) => e.PARTY === d.party).ALLIANCE
            )
          : alliances.add("OTHERS")
      })
      alliances = [...alliances]
      alliances.map((d, index) => {
        tableData.push({
          alliance: d,
          seats: index == 0 ? 1 : 0,
          votes: 0,
          votesPercent: 0
        })
      })
      constituencyStats.map((d) => {
        let tempAlliance = partyAlliance.find((e) => e.PARTY == d.party)
          ? partyAlliance.find((e) => e.PARTY == d.party).ALLIANCE
          : "OTHERS"
        let tempIndex = tableData.indexOf(
          tableData.find(({ alliance }) => alliance == tempAlliance)
        )
        tableData[tempIndex].votes += d.votesReceived
      })
    }
  }
  tableData.map((d) => (totalVotes += d.votes))
  tableData.map(
    (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
  )
  return tableData
}

const getPrevYearDataTable = (
  prevYearData,
  SVGData,
  electionType,
  groupType,
  partyAlliance,
  selectedStateUT,
  selectedConstituency,
  stateUTMapDataConstituencies
) => {
  let prevStateUTMapData = {}
  let prevSVGData = {}
  let prevSelectedStateUTData = []
  let prevStats = []

  if (prevYearData) {
    prevSelectedStateUTData = getDataStateUT(prevYearData, selectedStateUT)
    const prevSelectedConstituencyData =
      prevSelectedStateUTData &&
      getDataConstituency(
        prevSelectedStateUTData,
        selectedConstituency,
        electionType
      )
    if (prevYearData) {
      prevStateUTMapData = getStateUTMapDataPC(
        prevYearData,
        selectedStateUT,
        electionType
      )
    }
    const prevConstituenciesResults =
      prevStateUTMapData &&
      getConstituenciesResults(
        prevStateUTMapData,
        selectedConstituency,
        electionType,
        groupType,
        partyAlliance
      )
    if (electionType === "general") {
      if (
        selectedStateUT === STATE_UT_DEFAULT_SELECT ||
        selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
      ) {
        prevStats =
          prevConstituenciesResults &&
          SVGData &&
          prevSeatsVotesCount(
            prevSelectedStateUTData,
            prevConstituenciesResults,
            SVGData,
            selectedStateUT,
            selectedConstituency,
            stateUTMapDataConstituencies,
            electionType,
            groupType,
            partyAlliance
          )
      } else {
        prevStats =
          prevConstituenciesResults &&
          SVGData &&
          prevSeatsVotesCount(
            prevStateUTMapData.constituencies,
            [],
            SVGData,
            selectedStateUT,
            selectedConstituency,
            stateUTMapDataConstituencies,
            electionType,
            groupType,
            partyAlliance
          )
      }
    } else {
      if (selectedStateUT === STATE_UT_DEFAULT_SELECT) {
        prevStats = []
      } else {
        prevStats =
          prevConstituenciesResults &&
          SVGData &&
          prevSeatsVotesCount(
            selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
              ? prevSelectedStateUTData
              : prevSelectedConstituencyData,
            SVGData,
            selectedStateUT,
            selectedConstituency,
            stateUTMapDataConstituencies,
            electionType,
            groupType,
            partyAlliance
          )
      }
    }
    return prevStats
  }
}

const prevSeatsVotesCount = (
  data,
  constituenciesResults,
  SVGData,
  selectedStateUT,
  selectedConstituency,
  stateUTMapDataConstituencies,
  electionType,
  groupType,
  partyAlliance
) => {
  let stats = []
  let totalVotes = 0
  if (electionType === "general") {
    if (
      selectedStateUT === STATE_UT_DEFAULT_SELECT ||
      selectedConstituency === CONSTITUENCIES_DEFAULT_SELECT
    ) {
      const groups = Object.keys(SVGData)
      groups.indexOf("OTHERS") === -1 ? groups.push("OTHERS") : ""
      if (groupType === "party") {
        groups.map((d) =>
          stats.push({
            party: d,
            seats: 0,
            votes: 0,
            votesPercent: 0
          })
        )
        data.map((d) => {
          const temp =
            stats.findIndex(
              (e) => e == stats.find(({ party }) => party === d.PARTY)
            ) != -1
              ? stats.findIndex(
                  (e) => e == stats.find(({ party }) => party === d.PARTY)
                )
              : stats.length - 1
          if (!Number.isNaN(parseInt(d.VOTES))) {
            stats[temp].votes += parseInt(d.VOTES)
          }
        })
        constituenciesResults.map((d) => {
          const temp =
            stats.findIndex(
              (e) => e == stats.find(({ party }) => party === d.party)
            ) != -1
              ? stats.findIndex(
                  (e) => e == stats.find(({ party }) => party === d.party)
                )
              : stats.length - 1
          stats[temp].seats += 1
        })
      } else {
        groups.map((d) =>
          stats.push({
            alliance: d,
            seats: 0,
            votes: 0,
            votesPercent: 0
          })
        )
        data.map((d) => {
          const allianceTemp = partyAlliance.find((e) => e.PARTY == d.PARTY)
            ? partyAlliance.find((e) => e.PARTY === d.PARTY).ALLIANCE
            : "OTHERS"
          const temp =
            stats.findIndex(
              (e) =>
                e == stats.find(({ alliance }) => alliance === allianceTemp)
            ) != -1
              ? stats.findIndex(
                  (e) =>
                    e == stats.find(({ alliance }) => alliance === allianceTemp)
                )
              : stats.length - 1
          if (!Number.isNaN(parseInt(d.VOTES))) {
            stats[temp].votes += parseInt(d.VOTES)
          }
        })
        constituenciesResults.map((d) => {
          const temp =
            stats.findIndex(
              (e) => e == stats.find(({ alliance }) => alliance === d.alliance)
            ) != -1
              ? stats.findIndex(
                  (e) =>
                    e == stats.find(({ alliance }) => alliance === d.alliance)
                )
              : stats.length - 1
          stats[temp].seats += 1
        })
      }
      stats &&
        stats.map((d) => {
          if (!Number.isNaN(parseInt(d.votes))) {
            totalVotes += parseInt(d.votes)
          }
        })
      stats &&
        stats.map(
          (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
        )
      return stats
    } else {
      let groups = []
      let previousStats = []
      if (stateUTMapDataConstituencies.length != 0) {
        groups = stateUTMapDataConstituencies
          .find((e) => e.PC_NAME === selectedConstituency)
          .stats.map((d) => d.party)
        groups.indexOf("OTHERS") === -1 ? groups.push("OTHERS") : ""
        if (groupType === "party") {
          groups.map((d) =>
            stats.push({
              party: d,
              seats: 0,
              votes: 0,
              votesPercent: 0
            })
          )
          previousStats = data.find(
            (e) => e.PC_NAME === selectedConstituency
          ).stats
          previousStats.map((d) => {
            const temp =
              stats.findIndex(
                (e) => e == stats.find(({ party }) => party === d.party)
              ) != -1
                ? stats.findIndex(
                    (e) => e == stats.find(({ party }) => party === d.party)
                  )
                : stats.length - 1
            if (temp === 1) {
              stats[temp].seats += 1
              stats[temp].votes += d.votesReceived
            } else {
              const temp =
                stats.findIndex(
                  (e) => e == stats.find(({ party }) => party === d.party)
                ) != -1
                  ? stats.findIndex(
                      (e) => e == stats.find(({ party }) => party === d.party)
                    )
                  : stats.length - 1
              stats[temp].votes += d.votesReceived
            }
          })
        } else {
          let tempGroups = new Set()
          groups.map((d) => {
            const temp = partyAlliance.find((e) => e.PARTY == d)
              ? partyAlliance.find((e) => e.PARTY === d).ALLIANCE
              : "OTHERS"
            tempGroups.add(temp)
          })
          groups = [...tempGroups]
          groups.map((d) =>
            stats.push({
              alliance: d,
              seats: 0,
              votes: 0,
              votesPercent: 0
            })
          )
          previousStats = data.find(
            (e) => e.PC_NAME === selectedConstituency
          ).stats
          previousStats.map((d) => {
            const allianceTemp = partyAlliance.find((e) => e.PARTY == d.party)
              ? partyAlliance.find((e) => e.PARTY === d.party).ALLIANCE
              : "OTHERS"
            const temp =
              stats.findIndex(
                (e) =>
                  e == stats.find(({ alliance }) => alliance === allianceTemp)
              ) != -1
                ? stats.findIndex(
                    (e) =>
                      e ==
                      stats.find(({ alliance }) => alliance === allianceTemp)
                  )
                : stats.length - 1
            if (temp === 1) {
              stats[temp].seats += 1
              stats[temp].votes += d.votesReceived
            } else {
              const temp =
                stats.findIndex(
                  (e) =>
                    e == stats.find(({ alliance }) => alliance === allianceTemp)
                ) != -1
                  ? stats.findIndex(
                      (e) =>
                        e ==
                        stats.find(({ alliance }) => alliance === allianceTemp)
                    )
                  : stats.length - 1
              stats[temp].votes += d.votesReceived
            }
          })
        }
      }
      stats && stats.map((d) => (totalVotes += d.votes))
      stats &&
        stats.map(
          (d) => (d.votesPercent = ((d.votes / totalVotes) * 100).toFixed(2))
        )
      return stats
    }
  } else {
    return []
  }
}
